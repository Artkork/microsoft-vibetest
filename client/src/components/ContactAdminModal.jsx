import { useState } from 'react'

const EMPTY = { name: '', email: '', message: '' }

export default function ContactAdminModal({ onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState(null)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    setApiError(null)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to send message')
      }
      setSuccess(true)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>✉️ Contact Administrator</h2>
          <button className="modal-close" onClick={onClose} title="Close">✕</button>
        </div>

        {success ? (
          <div>
            <div className="contact-success">
              <span className="contact-success-icon">✅</span>
              <p>Your message has been sent to the administrator.</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-submit" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <>
            {apiError && <div className="error-banner" style={{ marginBottom: '1rem' }}>⚠️ {apiError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="cname">Your Name</label>
                  <input
                    id="cname"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cemail">Your Email</label>
                  <input
                    id="cemail"
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="cmessage">Message</label>
                  <textarea
                    id="cmessage"
                    placeholder="Write your message to the administrator…"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className={errors.message ? 'error' : ''}
                    style={{ minHeight: '120px' }}
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Sending…' : '✉️ Send Message'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
