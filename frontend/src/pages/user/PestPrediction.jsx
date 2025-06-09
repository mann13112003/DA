import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './PestPrediction.css';
import { pestPrediction, predictPestDisease } from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PestPrediction = ({ isOpen, onClose }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predictedPest, setPredictedPest] = useState('');
    const [confidenceScore, setConfidenceScore] = useState('');
    const { user } = useContext(AuthContext);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(null);
        setPredictedPest('');
        setConfidenceScore('');
    };

    const handleModalClose = () => {
        setFile(null);
        setPreviewUrl('');
        setResult(null);
        setLoading(false);
        setPredictedPest('');
        setConfidenceScore('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.warning('Vui lòng chọn ảnh!');

        if (!user || !user.id) {
            toast.error('Bạn chưa đăng nhập!');
            return;
        }

        setLoading(true);
        try {
            // Gửi ảnh lên FastAPI để nhận diện
            const formDataAI = new FormData();
            formDataAI.append('file', file);

            const fastapiRes = await predictPestDisease(formDataAI);
            const pestType = fastapiRes.data.class;
            const confidence = fastapiRes.data.confidence;

            setPredictedPest(pestType);
            setConfidenceScore(confidence);

            // Nếu là cây khỏe mạnh
            if (pestType === 'Healthy') {
                setResult({
                    pest_info: {
                        name: 'Cây lúa khỏe mạnh',
                        isHealthy: true
                    }
                });
                return;
            }

            // Nếu là bệnh - gửi ảnh và nhãn đến backend Node.js để lưu & lấy info
            const formData = new FormData();
            formData.append('image', file);
            formData.append('userId', user.id);
            formData.append('predictionLabel', pestType);
            formData.append('confidenceScore', confidence);

            try {
                const nodeRes = await pestPrediction(formData);
                const pestInfo = nodeRes.data?.pestPredictionResult?.data?.pest_info;

                if (pestInfo) {
                    setResult({ pest_info: pestInfo });
                } else {
                    // Không có trong database
                    setResult({
                        pest_info: {
                            name: 'Không có trong CSDL',
                            isUnknown: true,
                            scientific_name: pestType
                        }
                    });
                }
            } catch (error) {
                console.error("Lỗi gửi về Node.js:", error);
                toast.error('Lỗi khi gửi dữ liệu đến máy chủ!');
                setResult({
                    pest_info: {
                        name: 'Không có trong CSDL',
                        isUnknown: true,
                        scientific_name: pestType
                    }
                });
            }
        } catch (err) {
            console.error("Lỗi FastAPI:", err);
            toast.error('Lỗi xử lý ảnh!');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const pestInfo = result?.pest_info;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={handleModalClose}>&times;</span>
                <h2>Nhận diện sâu bệnh lúa</h2>
                <form onSubmit={handleSubmit}>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                    {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
                    <br />
                    {loading && <div className="spinner"></div>}
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Đang xử lý...' : 'Gửi ảnh'}
                    </button>
                </form>

                {pestInfo && (
                    <div className="result">
                        <h3>Kết quả nhận diện</h3>
                        {pestInfo.isHealthy ? (
                            <div className="healthy-result">
                                <p className="diagnosis">🌾 {pestInfo.name}</p>
                                <p className="confidence"><strong>Độ tin cậy:</strong> {(confidenceScore * 100).toFixed(2)}%</p>
                                <div className="recommendation">
                                    <h4>Khuyến nghị:</h4>
                                    <ul>
                                        <li>Tiếp tục duy trì chế độ chăm sóc hiện tại</li>
                                        <li>Theo dõi định kỳ để phát hiện sớm bệnh</li>
                                        <li>Đảm bảo đủ nước và phân bón</li>
                                    </ul>
                                </div>
                            </div>
                        ) : pestInfo.isUnknown ? (
                            <div className="unknown-result">
                                <p className="warning">⚠️ Phát hiện bệnh mới</p>
                                <p><strong>Tên khoa học:</strong> {pestInfo.scientific_name}</p>
                                <p><strong>Độ tin cậy:</strong> {(confidenceScore * 100).toFixed(2)}%</p>
                                <div className="recommendation">
                                    <h4>Khuyến nghị:</h4>
                                    <ul>
                                        <li>Tham khảo ý kiến chuyên gia nông nghiệp</li>
                                        <li>Cách ly khu vực bị bệnh</li>
                                        <li>Theo dõi sự phát triển của bệnh</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="disease-result">
                                <p><strong>Tên sâu bệnh:</strong> {pestInfo.name}</p>
                                <p><strong>Tên khoa học:</strong> {predictedPest}</p>
                                <p><strong>Độ tin cậy:</strong> {(confidenceScore * 100).toFixed(2)}%</p>
                                <Link
                                    to={`/pest-disease/${pestInfo.id}`}
                                    className="view-detail-btn"
                                >
                                    Xem chi tiết và cách điều trị
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PestPrediction;
