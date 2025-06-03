import Note from "../models/note.model.js"
import { errorHandler } from "../utils/error.js"

export const addNote = async (req, res, next) => {
  const { title, content, tags ,user_mail} = req.body

  // const { id } = req.user
  // console.log("idhr",req);
  // console.log(req.body);
  if (!title) {
    return next(errorHandler(400, "Title is required"))
  }

  if (!content) {
    return next(errorHandler(401, "Content is required"))
  }

  if (!user_mail) {
    console.log("mail",user_mail);
    return next(errorHandler(402, "User mail is required"));
  }
  try {
    const note = Note.create({
      title,
      content,
      tags: tags || [],
      userMail: user_mail,
    })
    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Note unable to add",
      err:error
    })
  }
}

export const editNote = async (req, res, next) => {
  console.log(req.params);
  const note = await Note.findById(req.params.noteId)
  // console.log(note);

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }
  const { title, content, tags, user_mail } = req.body
  console.log(title,content,tags,user_mail);
  if (!title && !content) {
    return next(errorHandler(404, "No changes provided"))
  }

  try {
    const temp=await Note.findByIdAndUpdate(req.params.noteId,{
      title,
      content,
      tags:tags || [],
      userMail:user_mail,
    });
   console.log(temp);
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Note not updated successfully",
      note,
    })
  }
}

export const getAllNotes = async (req, res, next) => {
  // const userId = req.user.id
  try {
    // console.log(req);
    const user_mail=req.headers.authorization;
    // console.log(req.headers);
    // console.log(user_mail);
    const notes = await Note.find({ userMail:user_mail }).sort({ isPinned: -1 })
    console.log("notes:",notes);
    res.status(200).json({
      success: true,
      message: "All notes retrived successfully",
      notes,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNote = async (req, res, next) => {
  // const noteId = req.params
  // console.log(nodeId);
  // console.log(req.params);
  const note = await Note.findOne({ _id: req.params.noteId})

  if (!note) {
    return next(errorHandler(404, "Note not found"))
  }
  // console.log(note);
  try {
    // await Note.deleteOne({ _id: noteId, userId: req.user.id })
    await Note.findByIdAndDelete(req.params.noteId);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    })
  } catch (error) {
    // next(error)
    res.status(404).json({
      success: false,
      message: "Not deleted successfully",
    })
  }
}

export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId)

    if (!note) {
      return next(errorHandler(404, "Note not found!"))
    }
    else console.log(note);

    // if (req.user.id !== note.userId) {
    //   return next(errorHandler(401, "You can only update your own note!"))
    // }

    const { isPinned } = req.body

    note.isPinned = isPinned

    await note.save()
    console.log(note);

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    next(error)
  }
}

export const searchNote = async (req, res, next) => {
  const { query } = req.query

  if (!query) {
    return next(errorHandler(400, "Search query is required"))
  }

  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    })

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    })
  } catch (error) {
    next(error)
  }
}
