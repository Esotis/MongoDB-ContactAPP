const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

// menjalankan koneksi database dan mengambil schema
require('./utils/mongoose')
const Contact = require('./models/contact')

const app = express()
const port = 3000

// konfigurasi dan set up flash message
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())

//setup override untuk metode put,delete,dll
app.use(methodOverride('_method'))

//konfigurasi express server dan layout web 
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    const mahasiswa = [{
        nama: "John",
        age: 10
    },
    {
        nama: "Kelly",
        age: 90
    },
    {
        nama: "Tom",
        age: 19
    }
    ]
    res.render('index', {
        mahasiswa,
        layout: 'layouts/main-layout'
    })
})

app.get('/index', (req, res) => {
    const mahasiswa = [{
        nama: "John",
        age: 10
    },
    {
        nama: "Kelly",
        age: 90
    },
    {
        nama: "Tom",
        age: 19
    }
    ]
    res.render('index', {
        mahasiswa,
        layout: 'layouts/main-layout'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout'
    })
})

app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()

    res.render('contact', {
        layout: 'layouts/main-layout',
        contacts,
        message: req.flash('message')
    })
})

//halaman add contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',

    })
})

//proses tambah data
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplicate = await Contact.findOne({ nama: value })
        if (duplicate) {
            throw new Error('Nama Contact sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    body('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            layout: 'layouts/main-layout',
            errors: errors.array(),
        })

    } else {
        Contact.insertMany(req.body, (error, result) => {
            req.flash('message', 'Data Contact berhasil ditambahkan!')
            res.redirect('/contact')
        })
    }
})

//proses delete contact
app.delete('/contact', async (req, res) => {
    await Contact.deleteOne({ nama: req.body.nama })
    req.flash('message', 'Data Contact berhasil dihapus!')
    res.redirect('/contact')
})

//halaman edit contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        contact,

    })
})

//proses update contact
app.put('/contact', [
    body('nama').custom(async (value, { req }) => {
        const duplicate = await Contact.findOne({ nama: value })
        if (value !== req.body.oldNama && duplicate) {
            throw new Error('Nama Contact sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    body('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        })

    } else {
        delete req.body.oldNama
        await Contact.updateOne({ _id: req.body._id }, {
            $set: req.body
        })
        req.flash('message', 'Data Contact berhasil diupdate!')
        res.redirect('/contact')
    }
})

//halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })

    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail Contact',
        contact,
    })
})



app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`)
})
