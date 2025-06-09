import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/userHeader";
import UserFooter from "../../components/user/userFooter";
import FeatureCard from "../../components/user/featureCard";
import Banner from "../../assets/banner.png";
import './homepage.css'
import PestPrediction from "./PestPrediction";
import { FaMicroscope, FaSeedling, FaBug, FaTractor, FaChartBar } from 'react-icons/fa';

const HomePage = () =>{
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleNavigation = (path) => {
        navigate(path);
    }
    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }   
    return (
        <div>
            <UserHeader></UserHeader>
            <section className="vp-banner">
                <div className="banner-content">
                    <h2>LuasViet</h2>
                    <h3>Trợ lý ảo cho nhà nông</h3>
                    <p>Ứng dụng Nông nghiệp thông minh dễ dàng tra cứu thông tin về lúa và tích hợp công nghệ AI, 
                    giúp người nông dân dễ dàng chẩn đoán và theo dõi quá trình 
                    canh tác lúa hiệu quả.</p>
                    <button className="explore-btn" onClick={() => handleNavigation('/disease-detection')}>
                        Khám phá ngay →
                    </button>
                </div>
                <div className="banner-image">
                    <img src={Banner} alt="LuaViet Banner" />
                </div>
            </section>
            <section className="vp-features">
                <h3 className="features-title"> CÁC TÍNH NĂNG NỔI BẬT</h3>
                <div className="feature-list-grid">
                    <div className="image-container">
                        <img src="https://cdn.huaf.edu.vn/huafweb/sites/9/2022/05/anh-6.jpg" alt="AI chẩn đoán" />
                    </div>
                    <FeatureCard
                        icon={<FaMicroscope />}
                        title="Chẩn Đoán Sâu Bệnh "
                        description="Chỉ cần chụp ảnh cây lúa, LuasViet sẽ đưa ra chẩn đoán và cách điều trị các loại sâu/bệnh bằng công nghệ nhận diện AI."
                        buttonText="Chụp ảnh ngay"
                        onClick={openModal}
                        // onClick={() => handleNavigation('/disease-detection')}
                    />

                    <FeatureCard
                        icon={<FaSeedling />}
                        title="Giống Lúa"
                        description="Tìm hiểu về các giống lúa phổ biến, đặc điểm và hướng dẫn canh tác phù hợp."
                        buttonText="Xem ngay"
                        onClick={() => handleNavigation('/rice-variety')}
                    />
                    <div className="image-container">
                        <img src="https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/lua_mi_va_lua_gao_khac_nhau_nhu_the_nao_huong_dan_ban_cach_an_phu_hop_de_tot_cho_suc_khoe_2_61112fb4bd.jpg" alt="Giống lúalúa" />
                    </div>

                    <div className="image-container">
                        <img src="https://psc1.com/upload_images/images/2021/09/02/Benh%20dao%20on.jpg" alt="Sâu bệnh" />
                    </div>
                    <FeatureCard
                        icon={<FaBug />}
                        title="Sâu Bệnh Hại"
                        description="Thông tin chi tiết về các loại sâu bệnh hại phổ biến trên cây lúa và biện pháp phòng trị."
                        buttonText="Xem ngay"
                        onClick={() => handleNavigation('/pest-disease')}
                    />

                    <FeatureCard
                        icon={<FaTractor />}
                        title="Kỹ Thuật Canh Tác"
                        description="Hướng dẫn chi tiết về kỹ thuật canh tác lúa từ các chuyên gia nông nghiệp."
                        buttonText="Xem ngay"
                        onClick={() => handleNavigation('/cultivation')}
                    />
                    <div className="image-container">
                        <img src="https://khoahockythuat.ninhbinh.gov.vn/public/userfiles/image/Nam%202022/Thang_10/Quy_trinh_canh_tac_Lua_huu_co.jpg" alt="Ứng dụng VietPlant" />
                    </div>

                    <div className="image-container">
                        <img src="https://binhdien.com/images/2018/mo_hinh_lua_tom.jpg" alt="Ứng dụng VietPlant" />
                    </div>
                    <FeatureCard
                        icon={<FaChartBar />}
                        title="Mô Hình Canh Tác"
                        description="Khám phá các mô hình canh tác lúa tiên tiến giúp tăng năng suất và bảo vệ môi trường."
                        buttonText="Xem ngay"
                        onClick={() => handleNavigation('/model-farm')}
                    />
                </div>
            </section>
            <PestPrediction isOpen={isModalOpen} onClose={closeModal} />
            <UserFooter></UserFooter>
        </div>
    )
}
export default HomePage