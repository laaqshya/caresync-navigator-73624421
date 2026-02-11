import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import { patients, doctors } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  const processCommand = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();

    // Navigation commands
    if (lower.includes('pending')) {
      navigate('/pending-actions');
      toast({ title: '🎤 Voice Command', description: 'Navigating to Pending Actions' });
      return;
    }
    if (lower.includes('delayed')) {
      navigate('/delayed-actions');
      toast({ title: '🎤 Voice Command', description: 'Navigating to Delayed Actions' });
      return;
    }
    if (lower.includes('active') || lower.includes('workflow')) {
      navigate('/active-workflow');
      toast({ title: '🎤 Voice Command', description: 'Navigating to Active Workflow' });
      return;
    }
    if (lower.includes('doctor')) {
      // Check for specific doctor name
      const doc = doctors.find(d => lower.includes(d.name.toLowerCase().replace('dr. ', '')));
      if (doc) {
        navigate(`/doctors/${doc.id}`);
        toast({ title: '🎤 Voice Command', description: `Opening ${doc.name}` });
        return;
      }
      navigate('/doctors');
      toast({ title: '🎤 Voice Command', description: 'Navigating to Doctors' });
      return;
    }
    if (lower.includes('patient')) {
      // Check for specific patient name
      const patient = patients.find(p => lower.includes(p.name.toLowerCase()));
      if (patient) {
        navigate(`/patients/${patient.id}`);
        toast({ title: '🎤 Voice Command', description: `Opening ${patient.name}` });
        return;
      }
      navigate('/patients');
      toast({ title: '🎤 Voice Command', description: 'Navigating to Patients' });
      return;
    }

    // Search by name across patients and doctors
    const matchedPatient = patients.find(p =>
      p.name.toLowerCase().split(' ').some(w => lower.includes(w) && w.length > 2)
    );
    if (matchedPatient) {
      navigate(`/patients/${matchedPatient.id}`);
      toast({ title: '🎤 Voice Command', description: `Opening ${matchedPatient.name}` });
      return;
    }

    toast({ title: '🎤 Voice Command', description: `"${text}" — command not recognized`, variant: 'destructive' });
  }, [navigate]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Voice not supported', description: 'Your browser does not support speech recognition.', variant: 'destructive' });
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
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      processCommand(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.start();
    setListening(true);
  }, [listening, processCommand]);

  return (
    <button
      onClick={toggleListening}
      className={cn(
        'relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300',
        listening
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
      )}
      title={listening ? t('voiceListening') : t('voiceReady')}
    >
      {listening && (
        <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
      )}
      {listening ? <MicOff className="w-4 h-4 relative z-10" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}
