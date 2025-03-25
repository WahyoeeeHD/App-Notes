import Swal from 'sweetalert2';

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['title', 'body', 'createdAt', 'archived'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const body = this.getAttribute('body') || '';
    const createdAt = new Date(
      this.getAttribute('createdAt')
    ).toLocaleDateString();
    const archived = JSON.parse(this.getAttribute('archived') || 'false');

    this.shadowRoot.innerHTML = `
      <style>
        .note {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 5px;
          background: ${archived ? '#f8d7da' : '#fff'};
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
          word-wrap: break-word;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .note h3 {
          margin: 0;
        }
        .note p {
          font-size: 14px;
          white-space: pre-wrap;
          flex-grow: 1;
        }
        .note small {
          display: block;
          text-align: right;
          color: #555;
        }
        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        button {
          cursor: pointer;
          padding: 5px 10px;
          border: none;
          border-radius: 3px;
        }
        .delete {
          background-color: #e74c3c;
          color: white;
        }
        .archive {
          background-color: #3498db;
          color: white;
        }
      </style>
      <div class="note">
            <h3>${title}</h3>
            <p>${body}</p>
            <small>${createdAt}</small>
            <div class="actions">
                <button class="archive">${archived ? 'Hapus dari Arsip' : 'Arsipkan'}</button>
                <button class="delete">Hapus</button>
            </div>
        </div>
    `;

    this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Catatan ini akan dihapus!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Hapus!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.dispatchEvent(
            new CustomEvent('delete-note', {
              bubbles: true,
              composed: true,
              detail: this.getAttribute('id'),
            })
          );
          Swal.fire('Terhapus!', 'Catatan telah dihapus.', 'success');
        }
      });
      this.dispatchEvent(
        new CustomEvent('delete-note', {
          bubbles: true,
          composed: true,
          detail: this.getAttribute('id'),
        })
      );
    });

    if (archived === false) {
      this.shadowRoot
        .querySelector('.archive')
        .addEventListener('click', () => {
          Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Catatan ini akan diarsip!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Arsip!',
          }).then((result) => {
            if (result.isConfirmed) {
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
                        text: 'Catatan telah berhasil diarsipkan.',
                      });
                    }, 500); // Loading selama 3 detik
                  },
                });
              }
              showLoading();
              this.dispatchEvent(
                new CustomEvent('archive-note', {
                  bubbles: true,
                  composed: true,
                  detail: this.getAttribute('id'),
                })
              );
              // Swal.fire('Terarsip!', 'Catatan telah diarsip.', 'success');
            }
          });
        });
    } else {
      this.shadowRoot
        .querySelector('.archive')
        .addEventListener('click', () => {
          Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Catatan ini akan dihapus dari arsip!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Hapus!',
          }).then((result) => {
            if (result.isConfirmed) {
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
                        text: 'Catatan telah berhasil dihapus dari arsip.',
                      });
                    }, 500); // Loading selama 3 detik
                  },
                });
              }
              showLoading();
              this.dispatchEvent(
                new CustomEvent('unarchive-note', {
                  bubbles: true,
                  composed: true,
                  detail: this.getAttribute('id'),
                })
              );
              // Swal.fire('Terhapus!', 'Catatan telah dihapus dari arsip.', 'success');
            }
          });
        });
    }
  }
}
customElements.define('note-item', NoteItem);
