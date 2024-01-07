const jwt = require("jsonwebtoken");
const { User } = require("../model/user");

async function auth(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(400).send({ error: 'Bad Request', message: 'Please provide authorization token.' });

    try {
        const decodeId = jwt.decode(token);
        const user = await User.findOne({ _id: decodeId._id }).select('-password');
        if (!user) return res.status(400).send({ message: "Bad Request", data: "You are not admin." });
        if (user.role != 'admin') return res.status(400).send({ message: "Bad Request", data: "You are not admin." });
        if (!user.enabled) return res.status(400).send({ message: "Bad Request", data: "You are deactiaved. Please contact support." });
        // add user information ( header token ) into req 
        req.user = user;
        next();
    } catch (err) {
        return res.status(408).send({ error: "Request timed-out", message: "Invalid token" });
    }
}

module.exports = auth