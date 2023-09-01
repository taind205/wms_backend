var jwt = require('jsonwebtoken');
const secret_key='123'

const get_Role = (req, res, next) => {
    const req_jwr=req.get('Authorization') || req.cookies.jwt;
    console.log('req jwt', req_jwr);
    // const req_jwr=
    console.log('req cookies', req.cookies);
    if(!req_jwr)
    {
        res.send({msg:'Người dùng không xác thực', err:3});
        return;
    }
    try{
    var decoded = jwt.verify(req_jwr, secret_key);}
    catch(err){
        console.log(err);
        res.send({msg:'Không thể xác thực người dùng', err:4});
        return;
    }
    console.log('decoded jwt', decoded)
    res.send({role:decoded.r});
} 

const admin_Auth = (req, res, next) => {
    const req_jwr=req.get('Authorization') || req.cookies.jwt;
    console.log('req jwt', req_jwr);
    console.log('req cookies', req.cookies);
    if(!req_jwr)
    {
        res.send({msg:'Người dùng không xác thực', err:3});
        return;
    }
    try{
    var decoded = jwt.verify(req_jwr, secret_key);}
    catch(err){
        console.log(err);
        res.send({msg:'Không thể xác thực người dùng', err:4});
        return;
    }
    console.log('decoded jwt', decoded)
    res.locals.user = decoded.u;
    next();
} 

const warehouseKeeper_Auth = (req, res, next) => {
    const req_jwr=req.get('Authorization') || req.cookies.jwt;;
    console.log('req jwt', req_jwr);
    console.log('req cookies', req.cookies);
    if(!req_jwr)
    {
        res.send({msg:'Người dùng không xác thực', err:3});
        return;
    }
    try{
    var decoded = jwt.verify(req_jwr, secret_key);}
    catch(err){
        console.log(err);
        res.send({msg:'Không thể xác thực người dùng', err:4});
        return;
    }
    console.log('decoded jwt', decoded)
    res.locals.user = decoded.u;
    res.locals.warehouse = decoded.w;
    next();
} 

const business_Auth = (req, res, next) => {
    const req_jwr=req.get('Authorization') || req.cookies.jwt;;
    console.log('req jwt', req_jwr);
    console.log('req cookies', req.cookies);
    if(!req_jwr)
    {
        res.send({msg:'Người dùng không xác thực', err:3});
        return;
    }
    try{
    var decoded = jwt.verify(req_jwr, secret_key);}
    catch(err){
        console.log(err);
        res.send({msg:'Không thể xác thực người dùng', err:4});
        return;
    }
    console.log('decoded jwt', decoded)
    res.locals.user = decoded.u;
    next();
} 

module.exports = { admin_Auth, warehouseKeeper_Auth, business_Auth, get_Role }