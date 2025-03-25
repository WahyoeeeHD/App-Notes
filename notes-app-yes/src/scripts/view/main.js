import Swal from 'sweetalert2';
import gsap from 'gsap';
import {
  fetchNotes,
  fetchArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from '../data/notes-api.js';

export const home = async () => {
  const app = document.querySelector('notes-app');
  const form = document.getElementById('note-form');
  const titleInput = document.getElementById('title');
  const bodyInput = document.getElementById('body');
  const titleError = document.getElementById('title-error');
  const bodyError = document.getElementById('body-error');

  titleError.style.color = 'red';
  bodyError.style.color = 'red';

  function validateInput() {
    let isValid = true;

    const titleValue = titleInput.value.trim();
    const bodyValue = bodyInput.value.trim();

    // Validasi untuk title
    if (titleValue === '') {
      titleError.textContent = 'Title is required';
      titleError.style.display = 'block';
      isValid = false;
    } else if (titleValue.length < 2) {
      titleError.textContent = 'Title must be at least 2 characters long';
      titleError.style.display = 'block';
      isValid = false;
    } else {
      titleError.style.display = 'none';
    }

    // Validasi untuk body
    if (bodyValue === '') {
      bodyError.textContent = 'Body is required';
      bodyError.style.display = 'block';
      isValid = false;
    } else if (bodyValue.length < 5) {
      bodyError.textContent = 'Body must be at least 5 characters long';
      bodyError.style.display = 'block';
      isValid = false;
    } else {
      bodyError.style.display = 'none';
    }

    return isValid;
  }

  titleInput.addEventListener('input', validateInput);
  bodyInput.addEventListener('input', validateInput);

  async function loadNotes() {
    try {
      const notes = await fetchNotes();
      const archivedNotes = await fetchArchivedNotes();
      app.notes = notes;
      app.archivedNotes = archivedNotes;
      app.render();
    } catch (error) {
      console.error('Gagal memuat catatan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat catatan!',
      });
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    async function kocak() {
      try {
        const newNote = {
          title: titleInput.value.trim(),
          body: bodyInput.value.trim(),
        };
        console.log(newNote);
        addNote(newNote);

        function showLoading() {
          Swal.fire({
            title: 'Mohon Tunggu...',
            text: 'Sedang memproses data',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              // Simulasi proses async (misalnya fetch API)
              setTimeout(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil!',
                  text: 'Catatan telah berhasil ditambahkan.',
                });
              }, 500);
            },
          });
        }
        showLoading();
        // Swal.fire('Sukses!', 'Catatan berhasil ditambahkan.', 'success');
        loadNotes();
        form.reset();
      } catch (error) {
        console.error('Gagal menambahkan catatan:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal menambahkan catatan!',
        });
      }
    }
    kocak();
  });

  app.addEventListener('delete-note', async (event) => {
    const noteId = event.detail;
    console.log(noteId);
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Catatan ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNote(noteId);
        function showLoading() {
          Swal.fire({
            title: 'Mohon Tunggu...',
            text: 'Sedang memproses data',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              // Simulasi proses async (misalnya fetch API)
              setTimeout(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil!',
                  text: 'Catatan telah berhasil dihapus.',
                });
              }, 500); // Loading selama 3 detik
            },
          });
        }
        showLoading();
        // Swal.fire('Terhapus!', 'Catatan telah dihapus.', 'success');
        loadNotes();
      }
    });
  });

  app.addEventListener('archive-note', async (event) => {
    const noteId = event.detail;
    await archiveNote(noteId);

    // Swal.fire('Diarsipkan!', 'Catatan telah dipindahkan ke arsip.', 'success');
    loadNotes();
  });

  app.addEventListener('unarchive-note', async (event) => {
    const noteId = event.detail;
    await unarchiveNote(noteId);
    loadNotes();
  });

  loadNotes();
};
