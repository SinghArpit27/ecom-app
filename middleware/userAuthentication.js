import jwt from 'jsonwebtoken'

// Create Acces Token
export const createAccessToken = async (userData) => {
    try {
        // console.log(process.env.JWT_SECRET);
        const token = await jwt.sign({ _id: userData._id }, process.env.ACCESS_JWT_SECRET, { expiresIn: '10m' });
        return token;

    } catch (error) {
        console.log("While Creating jwt Token" + error.message);
    }
}

// Create Refresh Token
export const createRefreshToken = async (userData) => {
    try {
        // console.log(process.env.JWT_SECRET);
        const token = await jwt.sign({ _id: userData._id }, process.env.REFRESH_JWT_SECRET, { expiresIn: '1h' });
        return token;

    } catch (error) {
        console.log(error.message);
    }
}