const express = require('express');
const Book = require('./models/booksmodel')
const User = require('./models/usermodel')
const connectDB = require('./config/dbconnection');
const dotenv = require('dotenv')
const cors = require('cors');
const argon2 = require('argon2');
const verifyToken = require('./middleware/authmiddleware')
const generateToken = require('./controllers/generateToken')

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello, this is your Express backend!');
});


// registering user
app.post('/api/user/register', async (req, res) => {
    try {
        await connectDB();
        const { name, email, password } = req.body;
        const userAlreadyExists = await User.findOne({ email: email });
        console.log("password:" + password + " name: " + name + " email: " + email);
        const hashedPassword = await argon2.hash(password, {
            timeCost: 12,
            memoryCost: 2048,
            parallelism: 1,
        });
        console.log(hashedPassword)
        if (!userAlreadyExists) {
            await User.create({ name, email, password: hashedPassword, });
            return res.status(200).send("User Created")
        }
        return res.status(400).send('User already exists')
    } catch (error) {
        console.log(`Error creating user: ${error.message}`)
    }
})



// logging in user


app.post('/api/user/login', async (req, res) => {
    console.log(req.body)
    try {
        await connectDB();
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("user Doesn't Exists");
            return res.status(400).send("User doesn't Exists");
        }
        const valid = await argon2.verify(user.password, password)
        if (!valid) {
            return res.status(400).send("please enter valid password")
        }
        return res.status(200).send(generateToken({ email }))
    } catch (error) {
        console.log("error in login", error.message)
    }
})


// for fetching particular books
app.get('/api/books/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        await connectDB();
        const ID = req.params.id;
        const book = await Book.findById(ID);
        console.log(book)
        if (!book) {
            return res.status(404).send('No Books Found');
        }
        return res.status(200).json(book);
    } catch (error) {
        console.log(`Error in getting a book ${error.message}`)
    }

})

// get all books from the database

app.get('/api/books', async function (req, res) {
    try {
        await connectDB()
        const books = await Book.find()
        if (!books) {
            return res.status(404).send({ message: 'No books found' })
        }
        return res.status(200).send({ books })
    } catch (error) {
        console.log(`Error in fetching all books ${error.message}`)
    }
})


// update the products 

app.put('/api/books/update/:id', verifyToken, async function (req, res) {
    try {
        connectDB()
        const ID = req.params.id;
        console.log(ID)
        const book = await Book.findById(ID);
        const { title, price, thumbnail, description, type } = await req.body;
        const updatebooks = await Book.findByIdAndUpdate(ID, {
            ...(!title ? {} : { title }),
            ...(!description ? {} : { description }),
            ...(!price ? {} : { price }),
            ...(!thumbnail ? {} : { thumbnail }),
            ...(!type ? {} : { type }),
        });
        if (!updatebooks) {
            return res.status(404).send({ message: 'No books found' })
        }
        return res.status(200).send({ message: 'Book Updated Successfully' })
    } catch (error) {
        console.log(`Error in update book: ${error}`)
    }
})



app.delete('/api/books/delete/:id', verifyToken, async function (req, res) {
    try {
        connectDB()
        const ID = req.params.id;
        const book = await Book.findOneAndDelete({ _id: ID });
        return res.status(200).send({ message: 'Book Deleted Successfully' })
    } catch (error) {
        console.log(`Error in Delete book: ${error}`)
    }
})


app.post('/api/books/create', async (req, res) => {

    console.log(req.body)
    try {
        await connectDB();
        const { title, price, description, author, thumbnail, type } = req.body;
        await Book.create({ title, price, description, author, thumbnail, type });
        return res.status(200).send("product created successfully");
    } catch (error) {
        console.log(`Error creating ${error.message}`);
        return res.status(400).send(`Error creating ${error.message}`)
    }
})


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});
