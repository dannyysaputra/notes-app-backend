const { nanoid } = require("nanoid");
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    
    // id berupa string
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    // mengecek newNotes sudah masuk ke array notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan!',
            data: {
                noteId: id,
            },
        });

        response.code(201); // HTTP response status code => created
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak berhasil ditambahkan',
    });

    response.code(500); // HTTP response status code => Internal Server Error
    return response;
};

// mengembalikan data dengan nilai notes di dalamnya
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

// menampilkan detail dari notes yang sudah dibuat /node/{id}
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    /* dapatkan objek note dengan id yang didapatkan dari objek notes array 
    menggunakan method array filter() */
    const note = notes.filter((n) => n.id === id) [0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    };

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });

    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    /* mendapatkan index array pada objek sesuai id menggunakan method array findIndex() */
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response ({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });

        response.code(200);
        return response;
    };

    const response = h.response ({
        status: 'fail',
        message: 'Catatan gagal diperbarui. Id tidak ditemukan',
    });

    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    //dapatkan index dari objek catatan sesuai id yang didapatkan menggunakan findIndex()
    const index = notes.findIndex((note) => note.id === id);

    if(index !== -1) {

        // untuk menghapus data pada index menggunakan method array splice()
        notes.splice(index, 1);
        const response = h.response ({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });

        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak dapat ditemukan!',
    });

    response.code(404);
    return response;
};

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler
};