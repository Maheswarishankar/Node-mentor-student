import express from "express";
import { MongoClient } from "mongodb";

// Inislization............................

const app = express();
const PORT = 7000;

// Middleware.............................

app.use(express.json());

//Mongodb connection......................

const MONGO_URL = "mongodb+srv://Mahi:mahishan@cluster0.bebulzn.mongodb.net/MentorStudent";
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongodb is connected");

//........get home page..................

app.get("/", async (req, res) => {
    res.status(200).json({ message: "Mentor-student assigning with database" });
});

//.....................create mentors........................................

app.post("/create/mentors", async (req, res) => {
    try {
        const connection = await client.connect(MONGO_URL);
        const db = connection.db("Mentor");
        const result = await db.collection("mentors").insertMany(req.body);
        res.status(200).json({ message: "mentor created" });

    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });

    }
});

//....................create students.........................................

app.post("/create/students", async (req, res) => {
    try {
        const connection = await client.connect(MONGO_URL);
        const db = connection.db("Student");
        const result = await db.collection("students").insertMany(req.body);
        res.status(200).json({ message: "Students created" });

    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" });

    }
});

//.................Get all mentorlist.......................................

app.get("/mentor/list", async (req, res) => {
    try {
        const connection = await client.connect(MONGO_URL);
        const db = connection.db("Mentor");
        const result = await db.collection("mentors").find({}).toArray();
        res.status(200).json({
            result,
            message: "mentors list"
        });

    } catch (error) {
        res.status(500).json({

            message: "mentors list not viewed"
        })

    }
});
//....................Get all studentlist.....................................
app.get("/student/list", async (req, res) => {
    try {
        const connection = await client.connect(MONGO_URL);
        const db = connection.db("Student");
        const result = await db.collection("students").find({}).toArray();
        res.status(200).json({
            result,
            message: "Student list"
        })
    } catch (error) {
        res.status(500).json({
            message: "mentors list not viewed"
        })
    }
});
// Assign a mentor to student..........................................
//select one mentor and add multiple student...........................

app.patch("/assign/Student", async (req, res) => {
    try {
        const connection = await client.connect(MONGO_URL);
        const db = connection.db("Mentor");
        await db
            .collection("mentors")
            .updateOne(
                { mentor_name: req.body.mentor_name },
                { $push: { students: { $each: req.body.studentNames } } }
            );
        res.status(200).json({ message: "Students successfully added to mentor" });


    } catch (error) {
        res.status(500).json(
            { message: "Failed to add students to mentor" });
    }
});
// ..............students without mentor................................

app.get("/idle/students", async (req, res) => {
    try {
        let connection = await client.connect(MONGO_URL);
        let db = connection.db("Mentor");
        let result = await db
            .collection("students")
            .find({ mentor_Id: null })
            .toArray();
        res.status(200).json({
            message: "list of students without a mentor",
            result,
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

//................... students under mentor.............................

app.get("/students-under-mentor/:mentor_name", async (req, res) => {
    try {
        let client = await client.connect(MONGO_URL);
        let db = client.db("Mentor");
        let result = await db
            .collection("students")
            .find({ mentor_Id: req.params })
            .toArray();
        res.status(200).json({
            message: `students under mentor_Id: `,
            result,
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

app.listen(`${PORT}`, () => console.log(`Server Started Successfully:${PORT}`))