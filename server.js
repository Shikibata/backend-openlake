require('dotenv').config()
const express = require("express") ;
const app = express();
const path = require("path") ;
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
mongoose.set('strictQuery', true);
const { logEvents } = require('./middleware/logger')

const PORT = process.env.PORT || 3500
//import { fileURLToPath } from 'url';

//const __filename = fileURLToPath(import.meta.url);

//const __dirname = path.dirname(__filename);

console.log(process.env.PORT)

connectDB();

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

app.use('/users', require('./routes/userRoutes'))
app.use('/profile', require('./routes/profileRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/wire', require('./routes/wireRoutes'))
app.use('/explore', require('./routes/nftRoutes'))
app.use('/myNFTs', require('./routes/myNftRoutes'))
app.use('/myTrades', require('./routes/myTradesRoutes'))
app.use('/openTrade', require('./routes/openTradeRoutes'))
app.use('/closeTrade', require('./routes/closeTradeRoutes'))
app.use('/index', require('./routes/tradesRoutes'))
app.use('/closedPNL', require('./routes/closedPNLRoutes'))
app.use('/openPNL', require('./routes/openPNLRoutes'))
app.use('/currentBalance', require('./routes/currentBalanceRoutes'))


app.all('*', (req,res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: "404 not found"})
    } else {
        res.type('text').send('404 not found')
    }
})

app.use(errorHandler)


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
