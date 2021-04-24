const express = require('express');
const router = express.Router();
const {nanoid} = require('nanoid');
const idlength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *      Book:
 *         type: object
 *         required:
 *           -title
 *           -author
 *         properties:
 *           id:
 *             type: string
 *             description: the author-generated id of the book
 *           title:
 *             type: string
 *             description: the book title
 *           author:
 *             type: string
 *             description: the book author
 *         
 *      example:
 *          id: d5fE_asz
 *          title: The New Turing Omnibus
 *          author: Alexander K. Downey
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing Api
 */

 /**
  * @swagger
  * /books:
  *   get:
  *     summary: Returns the list of all the books
  *     tags: [Books]
  *     responses:
  *       200:
  *         description: The list of the books
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Book' 
  */

router.get('/',(req,res)=>{
    const books = req.app.db.get("books");
    res.send(books);
})

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type:string
 *         required: true
 *         description: the book id
 *     responses:
 *       200:
 *         description: The book decription by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */
router.get('/:d',(req,res)=>{
  const book = req.app.db.get("books").find({id:req.params.id}).value();
  res.send(book);
})

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book 
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description:  The book was successfully created
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post('/',(req,res)=>{
    try{
        const book = {
            id:nanoid(idlength),
            ...req.body
        }
        req.app.db.get("books").push(book).write()
        res.send(book)
    }
    catch(error){
        return res.status(500).send(error);
    }
})

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *       500:
 *         description: Some server error
 */

router.put('/:id',(req,res)=>{
    try{
        req.app.db.get("books").find({id:req.params.id}).assign(req.body).write();
        res.send(req.app.get("books").find({id:req.params.id}));
    }
    catch(error){
        return res.status(500).send(error);
    }
})

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove a book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

router.delete('/:id',(req,res)=>{
    req.app.db.get("books").remove({id:req.params.id}).write();
    res.status(200);
})

module.exports = router;
