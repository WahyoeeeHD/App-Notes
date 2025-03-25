const API_URL = 'https://notes-api.dicoding.dev/v2/notes';

export async function fetchNotes() {
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

export async function fetchArchivedNotes() {
  try {
    const response = await fetch(`${API_URL}/archived`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching archived notes:', error);
    return [];
  }
}

export async function addNote(note) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Error adding note:', error);
    return false;
  }
}

export async function deleteNote(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
}

export async function archiveNote(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/archive`, {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    console.error('Error archiving note:', error);
    return false;
  }
}

export async function unarchiveNote(id) {
  try {
    const response = await fetch(`${API_URL}/${id}/unarchive`, {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    console.error('Error unarchiving note:', error);
    return false;
  }
}
