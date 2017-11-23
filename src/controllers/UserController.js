export const getUser = (req, res, con) => {
    const queryDb = () => {
        return new Promise((resolve, reject)=>{
            con.query("SELECT * FROM users", (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }
    const query2 = () => {
        return new Promise((resolve, reject)=>{
            con.query("SELECT email FROM users WHERE password='1234'", (err, result, fields) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }
    Promise.all([queryDb(),query2()])
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch((err)=>{
        res.status(500).json(err)         
    })
}

export const newUser = (req, res, con) => {
    
}