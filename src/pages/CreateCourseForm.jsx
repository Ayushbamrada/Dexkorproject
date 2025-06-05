import React, { useState } from 'react';
import axios from 'axios';
import ModuleForm from '../components/ModuleForm';

const CreateCourseForm = ({ onSubmit, onCancel }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [modules, setModules] = useState([
    {
      moduleTitle: '',
      moduleDescription: '',
      videos: [{ title: '', file: null }],
      documents: [],
      assignment: null,
      quiz: Array(5).fill({ question: '', options: ['', '', '', ''], correctAnswer: 0 }),
    },
  ]);

  const handleCourseTitleChange = (e) => setCourseTitle(e.target.value);
  const handleCourseDescriptionChange = (e) => setCourseDescription(e.target.value);

  const handleModuleChange = (index, updatedModule) => {
    const updatedModules = [...modules];
    updatedModules[index] = updatedModule;
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        moduleTitle: '',
        moduleDescription: '',
        videos: [{ title: '', file: null }],
        documents: [],
        assignment: null,
        quiz: Array(5).fill({ question: '', options: ['', '', '', ''], correctAnswer: 0 }),
      },
    ]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseTitle.trim() || !courseDescription.trim()) {
      alert('Course title and description are required.');
      return;
    }

    for (const mod of modules) {
      if (!mod.moduleTitle.trim() || !mod.moduleDescription.trim()) {
        alert('All modules must have title and description.');
        return;
      }
      for (const vid of mod.videos) {
        if (!vid.title.trim() || !vid.file) {
          alert('All videos must have title and file.');
          return;
        }
      }
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', courseTitle);
    formData.append('description', courseDescription);
    formData.append('teacherId', userId);

    modules.forEach((mod, modIndex) => {
      formData.append(`modules[${modIndex}][moduleTitle]`, mod.moduleTitle);
      formData.append(`modules[${modIndex}][moduleDescription]`, mod.moduleDescription);

      mod.videos.forEach((vid, vidIndex) => {
        formData.append(`modules[${modIndex}][videos][${vidIndex}][title]`, vid.title);
        formData.append(`modules[${modIndex}][videos][${vidIndex}][file]`, vid.file);
      });

      mod.documents.forEach((doc, docIndex) => {
        formData.append(`modules[${modIndex}][documents][${docIndex}]`, doc);
      });

      if (mod.assignment) {
        formData.append(`modules[${modIndex}][assignment]`, mod.assignment);
      }

      formData.append(`modules[${modIndex}][quiz]`, JSON.stringify(mod.quiz));
    });

    try {
      setSubmitting(true);
      const res = await axios.post('http://localhost:5000/api/create-course', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't manually set Content-Type for multipart/form-data
        },
      });

      alert('✅ Course created successfully!');
      onSubmit(res.data.course);

      // Reset form
      setCourseTitle('');
      setCourseDescription('');
      setModules([
        {
          moduleTitle: '',
          moduleDescription: '',
          videos: [{ title: '', file: null }],
          documents: [],
          assignment: null,
          quiz: Array(5).fill({ question: '', options: ['', '', '', ''], correctAnswer: 0 }),
        },
      ]);
    } catch (error) {
      console.error(error);
      alert(`❌ Failed to create course: ${error?.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow border text-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Create Course</h2>

      <div className="grid gap-2 mb-4">
        <label className="text-gray-600 font-medium">Course Title</label>
        <input
          type="text"
          value={courseTitle}
          onChange={handleCourseTitleChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          required
        />

        <label className="text-gray-600 font-medium mt-2">Course Description</label>
        <textarea
          value={courseDescription}
          onChange={handleCourseDescriptionChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          rows="2"
          required
        />
      </div>

      <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        {modules.map((mod, i) => (
          <ModuleForm
            key={i}
            moduleIndex={i}
            moduleData={mod}
            onModuleChange={handleModuleChange}
            onRemoveModule={removeModule}
          />
        ))}
      </div>

      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={addModule}
          className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Add Module
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          disabled={submitting}
          className="text-xs px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateCourseForm;
