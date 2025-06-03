import express from "express"
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  searchNote,
  updateNotePinned,
} from "../controller/note.controller.js"

const router = express.Router()

router.post("/add",  addNote)
router.post("/edit/:noteId",  editNote)
router.get("/all",  getAllNotes)
router.delete("/delete/:noteId",  deleteNote)
router.put("/update-note-pinned/:noteId",  updateNotePinned)
router.get("/search",  searchNote)

export default router
