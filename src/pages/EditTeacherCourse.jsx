"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const EditTeacherCourseForm = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [existingVideos, setExistingVideos] = useState([])
  const [existingDocuments, setExistingDocuments] = useState([])
  const [newVideoSections, setNewVideoSections] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch existing course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/course/${courseId}`)
        const course = res.data

        setCourseTitle(course.title || "")
        setCourseDescription(course.description || "")
        setExistingVideos(course.videos || [])
        setExistingDocuments(course.documents || [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching course:", err)
        alert("Failed to load course data")
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const handleCourseTitleChange = (e) => setCourseTitle(e.target.value)
  const handleCourseDescriptionChange = (e) => setCourseDescription(e.target.value)

  // Handle existing video title changes
  const handleExistingVideoTitleChange = (index, value) => {
    const updated = [...existingVideos]
    updated[index].title = value
    setExistingVideos(updated)
  }

  // Handle existing video file replacement
  const handleExistingVideoFileChange = (index, file) => {
    const updated = [...existingVideos]
    updated[index].newFile = file
    setExistingVideos(updated)
  }

  // Handle new video sections
  const handleNewVideoTitleChange = (index, value) => {
    const updated = [...newVideoSections]
    updated[index].title = value
    setNewVideoSections(updated)
  }

  const handleNewVideoFileChange = (index, file) => {
    const updated = [...newVideoSections]
    updated[index].file = file
    setNewVideoSections(updated)
  }

  const handleNewDocumentChange = (videoIndex, docIndex, file) => {
    const updated = [...newVideoSections]
    updated[videoIndex].documents[docIndex] = file
    setNewVideoSections(updated)
  }

  // Add new video section
  const addNewVideoSection = () => {
    setNewVideoSections([...newVideoSections, { title: "", file: null, documents: [] }])
  }

  // Add document to new video
  const addDocumentToNewVideo = (videoIndex) => {
    const updated = [...newVideoSections]
    updated[videoIndex].documents.push(null)
    setNewVideoSections(updated)
  }

  // Remove existing video
  const removeExistingVideo = (index) => {
    const updated = existingVideos.filter((_, i) => i !== index)
    setExistingVideos(updated)
  }

  // Remove new video section
  const removeNewVideoSection = (index) => {
    const updated = newVideoSections.filter((_, i) => i !== index)
    setNewVideoSections(updated)
  }

  // Handle existing document replacement
  const handleExistingDocumentChange = (index, file) => {
    const updated = [...existingDocuments]
    updated[index].newFile = file
    setExistingDocuments(updated)
  }

  // Remove existing document
  const removeExistingDocument = (index) => {
    const updated = existingDocuments.filter((_, i) => i !== index)
    setExistingDocuments(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!courseTitle.trim() || !courseDescription.trim()) {
      alert("Title and description are required.")
      return
    }

    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (!token || !userId) {
      alert("You must be logged in.")
      return
    }

    const formData = new FormData()
    formData.append("title", courseTitle)
    formData.append("description", courseDescription)
    formData.append("teacherId", userId)

    // Add existing videos data
    existingVideos.forEach((video) => {
      formData.append("existingVideoIds", video._id)
      formData.append("existingVideoTitles", video.title)
      if (video.newFile) {
        formData.append("updatedVideos", video.newFile)
      }
    })

    // Add new videos
    newVideoSections.forEach((video) => {
      if (video.title && video.file) {
        formData.append("newVideoTitles", video.title)
        formData.append("newVideos", video.file)
        video.documents.forEach((doc) => {
          if (doc) {
            formData.append("newDocuments", doc)
          }
        })
      }
    })

    // Add existing documents data
    existingDocuments.forEach((doc) => {
      formData.append("existingDocumentIds", doc._id)
      if (doc.newFile) {
        formData.append("updatedDocuments", doc.newFile)
      }
    })

    try {
      setSubmitting(true)
      const res = await axios.put(`http://localhost:5000/api/course/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(res)
      alert("✅ Course updated successfully!")
      navigate(`/teacher-dashboard/course/${courseId}`)
    } catch (error) {
      alert("❌ Failed to update course.")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(`/teacher/course/${courseId}`)
  }

  if (loading) {
    return <div className="p-4">Loading course data...</div>
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-4xl mx-auto">
        <div className=' flex items-center justify-between '>
            <h2 className="text-3xl font-bold mb-6">Edit Course</h2>
            <button 
                onClick={() => navigate(`/teacher-dashboard/course/${courseId}`)}
                className=' border rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold p-2 px-4 flex items-center justify-center' 
                >Preview</button>
            </div>

      <form onSubmit={handleSubmit}>
        {/* Course Title */}
        <label className="block mb-2 font-medium">Course Title</label>
        <input
          type="text"
          value={courseTitle}
          onChange={handleCourseTitleChange}
          className="w-full p-3 mb-4 border rounded-lg"
          placeholder="Enter course title"
          required
        />

        {/* Course Description */}
        <label className="block mb-2 font-medium">Course Description</label>
        <textarea
          value={courseDescription}
          onChange={handleCourseDescriptionChange}
          className="w-full p-3 mb-6 border rounded-lg"
          rows="4"
          placeholder="Describe your course"
          required
        />

        {/* Existing Videos Section */}
        {existingVideos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">📹 Existing Videos</h3>
            {existingVideos.map((video, index) => (
              <div key={video._id} className="mb-6 border p-4 rounded-lg bg-blue-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium">Video {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeExistingVideo(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Remove
                  </button>
                </div>

                {/* Video Title */}
                <input
                  type="text"
                  value={video.title}
                  onChange={(e) => handleExistingVideoTitleChange(index, e.target.value)}
                  className="w-full p-2 mb-3 border rounded"
                  placeholder="Video title"
                  required
                />

                {/* Current Video Preview */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Current video:</p>
                  <video
                    src={`http://localhost:5000${video.videoUrl}`}
                    className="w-full max-w-md border rounded"
                    controls={false}
                    preload="metadata"
                  />
                </div>

                {/* Replace Video */}
                <div className="mb-4">
                  <label className="inline-block mb-2 font-medium text-sm">Replace Video (optional)</label>
                  <label className="block cursor-pointer w-full p-3 border-2 border-dashed border-blue-400 rounded text-center text-blue-700 hover:bg-blue-50">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleExistingVideoFileChange(index, e.target.files[0])}
                      className="hidden"
                    />
                    {video.newFile ? video.newFile.name : "Click to choose new video file"}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Existing Documents Section */}
        {existingDocuments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">📄 Existing Documents</h3>
            {existingDocuments.map((doc, index) => (
              <div key={doc._id} className="mb-4 border p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{doc.title}</p>
                  <button
                    type="button"
                    onClick={() => removeExistingDocument(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Remove
                  </button>
                </div>
                <a
                  href={`http://localhost:5000${doc.documentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm block mb-2"
                >
                  View current document
                </a>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={(e) => handleExistingDocumentChange(index, e.target.files[0])}
                  className="w-full p-2 border rounded text-sm"
                />
                {doc.newFile && <p className="text-sm mt-1 text-green-600">New file: {doc.newFile.name}</p>}
              </div>
            ))}
          </div>
        )}

        {/* New Video Sections */}
        {newVideoSections.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">🎥 New Videos</h3>
            {newVideoSections.map((section, vIndex) => (
              <div key={vIndex} className="mb-6 border p-4 rounded-lg bg-green-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium">New Video {vIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeNewVideoSection(vIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Remove
                  </button>
                </div>

                {/* Video Title */}
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleNewVideoTitleChange(vIndex, e.target.value)}
                  className="w-full p-2 mb-3 border rounded"
                  placeholder="Video title"
                  required
                />

                {/* Upload Video */}
                <div className="mb-4">
                  <label className="inline-block mb-2 font-medium">Upload Video</label>
                  <label className="block cursor-pointer w-full p-3 border-2 border-dashed border-green-400 rounded text-center text-green-700 hover:bg-green-50">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleNewVideoFileChange(vIndex, e.target.files[0])}
                      className="hidden"
                      required
                    />
                    {section.file ? section.file.name : "Click to choose video file"}
                  </label>
                </div>

                {/* Related Documents */}
                <h5 className="font-medium mb-2">📄 Documents for this video</h5>
                {section.documents.map((doc, docIndex) => (
                  <div key={docIndex} className="mb-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      onChange={(e) => handleNewDocumentChange(vIndex, docIndex, e.target.files[0])}
                      className="w-full p-2 border rounded"
                    />
                    {doc && <p className="text-sm mt-1 text-gray-600">{doc.name}</p>}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDocumentToNewVideo(vIndex)}
                  className="text-sm text-green-600 underline"
                >
                  + Add Document
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Video Button */}
        <button
          type="button"
          onClick={addNewVideoSection}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add New Video
        </button>

        {/* Submit / Cancel */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Updating..." : "Update Course"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTeacherCourseForm
