const {Pool} = require('pg')
const pool = new Pool ({
    user: ,
    password: ,
    hots: ,
    port: ,
    database: 
});

async function addData(userId, companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'INSERT INTO ApplicationTracker (CompanyName, DateApplied, Statuses, IncomingPhone, IncomingInterview, Notes) Values (?,?,?,?,?,?) Where UserId = ?',
            [companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes, userId]
        );
        return result;
    } catch (error) {
        console.log(error);
    } finally {
        if(conPool) {
        conPool.release();
        }
    }

}

async function getData(userId) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'SELECT * FROM ApplicationTracker Where UserId = ?'
            [userId]
        );
        return result;
    } catch (error) {
        
    } finally {
        if(conPool) {
            conPool,release();
        }
    }
}

async function getCountReplies(userId) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'SELECT Count(*) From ApplicationTracker WHERE UserId = ? AND Statuses = "rejected" or Statuses = "ongoing" or Statuses = "offer"'
            [userId]
        );
        return result;
    } catch (error) {
        
    }finally {
        if(conPool) {
            conPool.release();
        }
    }
}
async function getCountRows(userId) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'SELECT Count(*) From ApplicationTracker Where UserId = ?'
            [userId]
        );
        return result;
    } catch (error) {
        
    }finally {
        if(conPool) {
            conPool.release();
        }
    }
}
async function getRejections(userId) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'SELECT Count(*) From ApplicationTracker Where UserId = ? AND Statuses = "rejected"'
            [userId]
        );
        return result;
    } catch (error) {
        
    }finally {
        if(conPool) {
            conPool.release();
        }
    }
}
async function getIncomingPhone(userId) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'SELECT UserId, IncomingPhone From ApplicationTracker Where UserId = ?'
            [userId]
        );
        return result;
    } catch (error) {
        
    }finally {
        if(conPool) {
            conPool.release();
        }
    }
}
async function getIncomingInterview(userId) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'SELECT UserId, IncomingInterview From Applicationtracker Where UserId = ?'
            [userId]
        );
        return result;
    } catch (error) {
        
    } finally {
        if(conPool) {
            conPool.release();
        }
    }
}
async function updateData(userId, id, companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'Update ApplicationTracker SET CompanyName = ?, DateApplied = ?, Statuses = ?, IncomingPhone = ?, IncomingInterview = ?, Notes = ? Where UserId = ? AND ApplicationId = ?'
            [companyName, dateApplied, statuses, incomingPhone, incomingInterview, notes, userId, id]
        );
        return result;
    } catch (error) {
        
    } finally {
        if(conPool) {
            conPool.release();
        }
    }
}
async function deleteData(userId, id) {
    try {
        let conPool = await pool.getConnection();
        const [result] = await conPool.execute(
            'Delete FROM ApplicationTracker Where UserId = ? AND ApplicationId = ?'
            [userId, id]
        );
        return result;
    } catch (error) {
        
    } finally {
        if(conPool) {
            conPool.release();
        }
    }
}



module.exports = {
    addData, 
    getData,
    getCountReplies,
    getCountRows,
    getRejections,
    getIncomingPhone,
    getIncomingInterview,
    updateData,
    deleteData,
}