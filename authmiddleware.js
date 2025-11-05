import jwt from 'jsonwebtoken'

export const verifytoken=(req,res,next)=>{
    const token=req.cookies.token

    
    if(!token)
    {
        return res.status(401).json({error:"unothrized"})
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
        if(err)
        {
            return res.status(400).json({error:"invalied token"})
        }
        console.log(req.url)
        req.user=decode
        next()
    })
}
export const adminsonly=(req,res,next)=>
{
    console.log(req.user.admin)
    if(req.user.admin)
    {
        next()
    }
    else{
        res.status(403).json({error:"your restricted to this url"})   
    }
}