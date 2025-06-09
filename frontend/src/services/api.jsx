import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_PRE = import.meta.env.VITE_API_PREDICTION;
export const api = axios.create({
    //dev mode
    // baseURL: API_URL,
    baseURL: API_URL,
    headers: {},
    withCredentials: true,
})
// console.log('API_URL:', API_URL);
// console.log('API_PRE:', API_PRE);

export const apiPrediction = axios.create({
    baseURL: API_PRE,
    headers: {},
    withCredentials: true,
})

//users
export const register = async(data) => {
    return await api.post("/users/register",data);
};
export const login = async(data) => {
    return await api.post("/users/login",data);
};
export const getCurrentUser = async() => {
    return await api.get("/users/current-user")
}
export const logOut = async() => {
    return await api.post("/users/logout")
}
export const riceTypeList = async() => {
    return await api.get("/users/get-rice-types")
}

//admin
// User Management 
export const createUser = async(userData) => {
    return await api.post("/admin/create-user", userData);
};

export const updateUser = async(id, userData) => {
    return await api.put(`/admin/update-user/${id}`, userData);
};

export const deleteUser = async(id) => {
    return await api.delete(`/admin/delete-user/${id}`);
};

export const getUserProfile = async() => {
    return await api.get("/users/profile");
};

export const updateUserProfile = async(formData) => {
    return await api.put("/users/update-profile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const changePassword = async(passwordData) => {
    return await api.put("/users/change-password", passwordData);
};
export const listUsers = async() => {
    return await api.get("/admin/get-all-user")
}
//rice-variety
export const createRice = async(formData) => {
    return await api.post("/admin/create-rice",formData,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
        
    })
}
export const getAllRice = async() => {
    return await api.get("/admin/get-all-rice")
}
export const getRiceById = async(id) => {
    return await api.get(`/admin/get-rice/${id}`);
}
export const updateRice = async(id, formData) => {
    return await api.put(`/admin/update-rice/${id}`,formData,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
    })
}
export const deleteRice = async(id) => {
    return await api.delete(`/admin/delete-rice/${id}`)
}
//pest-disease
export const createPestDisease = async(formData) => {
    return await api.post("/admin/create-pest-disease",formData,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
        
    })
}
export const getAllPestDisease = async() => {
    return await api.get("/admin/get-all-pest-disease")
}
export const getPestDiseaseById = async(id) => {
    return await api.get(`/admin/get-pest-disease/${id}`);
}
export const updatePestDisease = async(id, formData) => {
    return await api.put(`/admin/update-pest-disease/${id}`,formData,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
    })
}
export const deletePestDisease = async(id) => {
    return await api.delete(`/admin/delete-pest-disease/${id}`)
}
export const getPestDiseaseByRiceId = async(id) => {
    return await api.get(`/users/get-pest-disease/${id}`)
}
export const pestCategoryList = async() => {
    return await api.get("/users/get-pest-diseases-category")
}
export const growthStageList = async() => {
    return await api.get("/users/get-pest-diseases-stages")
}
export const pestPrediction = async(formData) => {
    return await api.post("/users/pest-prediction",formData,{
        headers: {
            "Content-Type": "multipart/form-data", 
        }
        
    })
}

//cultivation
export const createCultivation = async(data) => {
    return await api.post("/admin/create-cultivation", data);
};

export const getAllCultivation = async() => {
    return await api.get("/admin/get-all-cultivation");
};

export const getCultivationById = async(id) => {
    return await api.get(`/admin/get-cultivation/${id}`);
};

export const updateCultivation = async(id, data) => {
    return await api.put(`/admin/update-cultivation/${id}`, data);
};

export const deleteCultivation = async(id) => {
    return await api.delete(`/admin/delete-cultivation/${id}`);
};

// Farming Model
export const createFarmingModel = async(formData) => {
    return await api.post("/admin/create-farming-model", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const getAllFarmingModel = async() => {
    return await api.get("/admin/get-all-farming-model");
};

export const getFarmingModelById = async(id) => {
    return await api.get(`/admin/get-farming-model/${id}`);
};

export const updateFarmingModel = async(id, formData) => {
    return await api.put(`/admin/update-farming-model/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const deleteFarmingModel = async(id) => {
    return await api.delete(`/admin/delete-farming-model/${id}`);
};
// Top Pest Disease Prediction
export const getTopPestPredictions = async () => {
    return await api.get('/admin/top-pest-predictions');
};

//predict-pest-disease
export const predictPestDisease = async(formData) => {
    return await apiPrediction.post("/predict", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    
}