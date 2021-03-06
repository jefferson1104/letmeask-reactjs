import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import IllustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import '../styles/auth.scss'

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error('Sala inexistente ou código incorreto.', {
        duration: 3000,
          position: "bottom-center",
          style: {
            border: '1px solid #835afd',
            padding: '16px',
            color: '#29292e',
            marginBottom: '100px'
          },
      });
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error('Está sala ja foi encerrada.', {
        duration: 3000,
          position: "bottom-center",
          style: {
            border: '1px solid #835afd',
            padding: '16px',
            color: '#29292e',
            marginBottom: '100px'
          },
      });
      return;
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letMeAsk" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
      <Toaster />
    </div>
  )
}