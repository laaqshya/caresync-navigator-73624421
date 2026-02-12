import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type Language } from '@/lib/i18n';
import { patients, doctors } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const langMap: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
};

export function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textCommand, setTextCommand] = useState('');
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const processCommand = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return;

    // Navigation commands
    if (lower.includes('pending') || lower.includes('pendiente') || lower.includes('attente')) {
      navigate('/pending-actions');
      toast({ title: '🎤 Voice Command', description: `Navigating to Pending Actions — "${text}"` });
      return;
    }
    if (lower.includes('delayed') || lower.includes('retras') || lower.includes('retard')) {
      navigate('/delayed-actions');
      toast({ title: '🎤 Voice Command', description: `Navigating to Delayed Actions — "${text}"` });
      return;
    }
    if (lower.includes('active') || lower.includes('workflow') || lower.includes('flujo') || lower.includes('flux')) {
      navigate('/active-workflow');
      toast({ title: '🎤 Voice Command', description: `Navigating to Active Workflow — "${text}"` });
      return;
    }
    if (lower.includes('home') || lower.includes('dashboard') || lower.includes('inicio') || lower.includes('accueil')) {
      navigate('/');
      toast({ title: '🎤 Voice Command', description: `Navigating to Home — "${text}"` });
      return;
    }
    if (lower.includes('doctor') || lower.includes('médecin')) {
      const doc = doctors.find(d => {
        const nameParts = d.name.toLowerCase().replace('dr. ', '').split(' ');
        return nameParts.some(part => part.length > 2 && lower.includes(part));
      });
      if (doc) {
        navigate(`/doctors/${doc.id}`);
        toast({ title: '🎤 Voice Command', description: `Opening ${doc.name}` });
        return;
      }
      navigate('/doctors');
      toast({ title: '🎤 Voice Command', description: `Navigating to Doctors — "${text}"` });
      return;
    }
    if (lower.includes('patient') || lower.includes('paciente')) {
      const patient = patients.find(p => {
        const nameParts = p.name.toLowerCase().split(' ');
        return nameParts.some(part => part.length > 2 && lower.includes(part));
      });
      if (patient) {
        navigate(`/patients/${patient.id}`);
        toast({ title: '🎤 Voice Command', description: `Opening ${patient.name}` });
        return;
      }
      navigate('/patients');
      toast({ title: '🎤 Voice Command', description: `Navigating to Patients — "${text}"` });
      return;
    }
    if (lower.includes('log out') || lower.includes('logout') || lower.includes('cerrar') || lower.includes('déconnexion')) {
      toast({ title: '🎤 Voice Command', description: 'Logout requested (not implemented in demo)' });
      return;
    }

    // Fuzzy name search
    const matchedPatient = patients.find(p =>
      p.name.toLowerCase().split(' ').some(w => w.length > 2 && lower.includes(w))
    );
    if (matchedPatient) {
      navigate(`/patients/${matchedPatient.id}`);
      toast({ title: '🎤 Voice Command', description: `Opening ${matchedPatient.name}` });
      return;
    }

    const matchedDoc = doctors.find(d =>
      d.name.toLowerCase().replace('dr. ', '').split(' ').some(w => w.length > 2 && lower.includes(w))
    );
    if (matchedDoc) {
      navigate(`/doctors/${matchedDoc.id}`);
      toast({ title: '🎤 Voice Command', description: `Opening ${matchedDoc.name}` });
      return;
    }

    toast({ title: '🎤 Voice Command', description: `"${text}" — command not recognized`, variant: 'destructive' });
  }, [navigate]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback to text input
      setShowTextInput(prev => !prev);
      toast({
        title: 'Speech not available',
        description: 'Use the text input to type commands instead.',
      });
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = langMap[lang] || 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        processCommand(transcript);
      }
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = (e: any) => {
      setListening(false);
      const errorMsg = e.error === 'not-allowed'
        ? 'Microphone access denied. Please allow microphone permissions.'
        : e.error === 'no-speech'
        ? 'No speech detected. Try again.'
        : `Speech error: ${e.error}`;
      toast({ title: '🎤 Voice Error', description: errorMsg, variant: 'destructive' });

      // Show text fallback on error
      if (e.error === 'not-allowed') {
        setShowTextInput(true);
      }
    };

    try {
      recognition.start();
      setListening(true);
      toast({ title: '🎤 Listening...', description: 'Speak a command now.' });
    } catch (err) {
      setListening(false);
      setShowTextInput(true);
      toast({ title: 'Voice Error', description: 'Could not start speech recognition. Use text input instead.', variant: 'destructive' });
    }
  }, [listening, processCommand, lang]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textCommand.trim()) {
      processCommand(textCommand.trim());
      setTextCommand('');
      setShowTextInput(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1">
      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="flex items-center gap-1">
          <Input
            value={textCommand}
            onChange={e => setTextCommand(e.target.value)}
            placeholder="Type a command..."
            className="h-8 w-48 text-xs"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowTextInput(false)}
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Text command toggle */}
      <button
        onClick={() => setShowTextInput(prev => !prev)}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
        title="Type a command"
      >
        <MessageSquare className="w-4 h-4" />
      </button>

      {/* Mic button */}
      <button
        onClick={toggleListening}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300',
          listening
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
            : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        )}
        title={listening ? t('voiceListening') : t('voiceReady')}
      >
        {listening && (
          <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
        )}
        {listening ? <MicOff className="w-4 h-4 relative z-10" /> : <Mic className="w-4 h-4" />}
      </button>
    </div>
  );
}
