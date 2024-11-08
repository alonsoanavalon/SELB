const mysqlConnection = require("../../database/database")

const createSessionLogged = (req, res) => {
    const { user_id, session_type } = req.body

    let query = null

    query = `SELECT * FROM session_type WHERE name = '${session_type}'`
    mysqlConnection.query(query, function(error, result, fields) {
        if (error != null || result == null || result.length === 0) {
            return res.status(404).json({
                message: "SESSION_TYPE_NOT_FOUND"
            })
        }

        query = `INSERT INTO session_logged SET ?`
        const post = {
            sessionTypeId: result[0].id, 
            userId: user_id
        }
        mysqlConnection.query(query, post, function(error, result, fields) {
            if (error != null || result == null) {
                return res.status(400).json({
                    message: "ERROR_CREATING_SESSION_LOGGED"
                })
            }
            
            return res.status(204).end()
        })
    })
}

const getAllSessionLogged = (req, res) => {
    const query = "SELECT session_logged.id, session_logged.sessionDate, session_type.name AS sessionTypeName, user.email AS userEmail, user.name AS userName, user.surname AS userSurName, user.role as userRole FROM session_logged INNER JOIN session_type ON session_logged.sessionTypeId = session_type.id INNER JOIN user ON session_logged.userId = user.id;"

    mysqlConnection.query(query, function (error, result, fields) {
        if (error != null || result == null) {
            return res.status(500).json({
                message: "ERROR_GETTING_SESSION_LOGGED"
            })
        }

        return res.status(200).json({
            sessions: result
        })
    })
}

module.exports = {
    createSessionLogged,
    getAllSessionLogged
}