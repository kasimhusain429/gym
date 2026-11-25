import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { COACHES, DISCIPLINES, PATHWAYS, PLATES } from '../data/club';
import { Barbell, Button } from './ui';

export type Prefill = { discipline?: string; pathway?: string; coach?: string; n: number };

type Field = 'name' | 'email' | 'phone';
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT as string | undefined;

type Payload = {
  name: string;
  email: string;
  phone: string;
  disciplines: string[];
  pathway: string;
  coach: string;
  message: string;
};

/**
 * Sends the enquiry to VITE_ENQUIRY_ENDPOINT as JSON. Without an endpoint the
 * dev server simulates success; a production build reports that online
 * enquiries are not connected rather than pretending to send.
 */
async function sendEnquiry(payload: Payload) {
  if (!ENDPOINT) {
    if (import.meta.env.DEV) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return;
    }
    throw new Error('not-configured');
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`status-${res.status}`);
}

export function EnquiryForm({ prefill }: { prefill: Prefill }) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [pathway, setPathway] = useState('not-sure');
  const [coach, setCoach] = useState('any');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');

  // A CTA elsewhere on the page pre-selects what the visitor was looking at.
  useEffect(() => {
    if (!prefill.n) return;
    const { discipline, pathway: p, coach: c } = prefill;
    if (discipline) setDisciplines((prev) => (prev.includes(discipline) ? prev : [...prev, discipline]));
    if (p) setPathway(p);
    if (c) {
      setCoach(c);
      setPathway('coaching');
    }
    setStatus((s) => (s === 'sent' ? 'idle' : s));
  }, [prefill]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your name.';
    if (!EMAIL.test(email.trim())) next.email = 'Enter an email address, like name@example.com.';
    if (phone.trim() && phone.replace(/\D/g, '').length < 7) {
      next.phone = 'Enter a phone number with at least 7 digits, or leave it blank.';
    }
    return next;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }
    setStatus('sending');
    setFailure('');
    try {
      await sendEnquiry({ name: name.trim(), email: email.trim(), phone: phone.trim(), disciplines, pathway, coach, message: message.trim() });
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setFailure(
        err instanceof Error && err.message === 'not-configured'
          ? 'Online enquiries are not connected yet. Please contact the club directly.'
          : 'Your enquiry did not send. Check your connection and try again.',
      );
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDisciplines([]);
    setPathway('not-sure');
    setCoach('any');
    setMessage('');
    setErrors({});
    setStatus('idle');
    requestAnimationFrame(() => document.getElementById(id('name'))?.focus());
  };

  if (status === 'sent') {
    return (
      <div className="sent" role="status" aria-live="polite">
        <Barbell loaded={6} width={220} height={60} />
        <h3>Pass requested</h3>
        <p>
          Thanks, {name.trim().split(' ')[0]}. We'll reply to {email.trim()} with rates and a time to come in.
        </p>
        <Button variant="ghost" onClick={reset}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const fieldError = (f: Field) =>
    errors[f] ? (
      <p className="field__error" id={id(`${f}-error`)}>
        {errors[f]}
      </p>
    ) : null;

  const describe = (f: Field) => (errors[f] ? id(`${f}-error`) : undefined);

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={id('fine')}>
      <div className="form__row form__row--2">
        <div className="field">
          <label className="field__label" htmlFor={id('name')}>
            Name
          </label>
          <input
            id={id('name')}
            className="input"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            aria-invalid={!!errors.name}
            aria-describedby={describe('name')}
            required
          />
          {fieldError('name')}
        </div>
        <div className="field">
          <label className="field__label" htmlFor={id('email')}>
            Email
          </label>
          <input
            id={id('email')}
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            aria-invalid={!!errors.email}
            aria-describedby={describe('email')}
            required
          />
          {fieldError('email')}
        </div>
      </div>

      <div className="form__row form__row--2">
        <div className="field">
          <label className="field__label" htmlFor={id('phone')}>
            Phone <small>(optional)</small>
          </label>
          <input
            id={id('phone')}
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            aria-invalid={!!errors.phone}
            aria-describedby={describe('phone')}
          />
          {fieldError('phone')}
        </div>
        <div className="field">
          <label className="field__label" htmlFor={id('coach')}>
            Coach <small>(optional)</small>
          </label>
          <select id={id('coach')} className="input" value={coach} onChange={(e) => setCoach(e.target.value)}>
            <option value="any">No preference</option>
            {COACHES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first} {c.last}, {c.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="fieldset">
        <legend className="field__label">
          What do you want to train? <small>(pick any)</small>
        </legend>
        <div className="chips">
          {DISCIPLINES.map((d) => (
            <label
              className="chip"
              key={d.id}
              style={{ '--plate': PLATES[d.plate].hex, '--plate-ink': PLATES[d.plate].ink } as CSSProperties}
            >
              <input
                type="checkbox"
                name="disciplines"
                value={d.id}
                checked={disciplines.includes(d.id)}
                onChange={(e) =>
                  setDisciplines((prev) => (e.target.checked ? [...prev, d.id] : prev.filter((x) => x !== d.id)))
                }
              />
              <span>{d.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="field__label">Membership</legend>
        <div className="chips">
          {[...PATHWAYS.map((p) => ({ id: p.id, name: p.name })), { id: 'not-sure', name: 'Not sure yet' }].map((p) => (
            <label className="chip" key={p.id}>
              <input
                type="radio"
                name="pathway"
                value={p.id}
                checked={pathway === p.id}
                onChange={() => setPathway(p.id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor={id('message')}>
          Anything we should know? <small>(optional)</small>
        </label>
        <textarea
          id={id('message')}
          className="input"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Goals, injuries, when you like to train"
        />
      </div>

      <div className="form__submit">
        <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Claim your pass'}
        </Button>
        <p className="form__fine" id={id('fine')}>
          We only use your details to reply to this enquiry.
        </p>
      </div>
      {status === 'error' && (
        <p className="form__status" role="alert">
          {failure}
        </p>
      )}
    </form>
  );
}
