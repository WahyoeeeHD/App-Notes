import { fetchNotes, fetchArchivedNotes } from '../data/notes-api.js';
import Swal from 'sweetalert2';

class NotesApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.notes = [];
    this.archivedNotes = [];
  }

  async connectedCallback() {
    await this.loadNotes();
  }

  async loadNotes() {
    try {
      this.notes = await fetchNotes();
      this.archivedNotes = await fetchArchivedNotes();
      this.render();
    } catch (error) {
      console.error('Error fetching notes:', error);
      this.innerHTML = '<p>Gagal memuat catatan.</p>';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat catatan!',
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          .notes-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 10px;
            padding: 10px;
          }

          h1{
            text-align: center;
          }

          span{
            color: #007bff;
          }
        </style>
        <h1>History <span>Catatan</span></h1>
        <div class="notes-container">
            ${
              this.notes.length === 0
                ? '<p>Tidak ada catatan.</p>'
                : this.notes
                    .map(
                      (note) =>
                        `<note-item id="${note.id}" title="${note.title}" body="${note.body}" createdAt="${note.createdAt}" archived="${note.archived}"></note-item>`
                    )
                    .join('')
            }
        </div>
        <h1>History <span>Arsip</span></h1>
        <div class="notes-container">
            ${this.archivedNotes.length === 0 ? '<p>Tidak ada catatan diarsipkan.</p>' : this.archivedNotes.map((note) => `<note-item id="${note.id}" title="${note.title}" body="${note.body}" createdAt="${note.createdAt}" archived="${note.archived}"></note-item>`).join('')}
        </div>
      `;
  }
}
customElements.define('notes-app', NotesApp);
