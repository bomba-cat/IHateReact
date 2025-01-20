import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const API = import.meta.env.VITE_API
const KEY = import.meta.env.VITE_KEY

const supabase = createClient(
  API,
  KEY
);

function App() {
  const [notes, setNotes] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getNotes();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getNotes() {
    const { data, error } = await supabase.from("notizen").select();
    if (error) {
      console.error("Fehler beim Abrufen der Notizen:", error);
    } else {
      setNotes(data);
    }
  }

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
      />
    );
  }

  return (
    <div>
      <h1>Notizen</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.notiz}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
