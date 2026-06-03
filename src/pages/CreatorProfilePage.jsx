import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'
import ProgressBar from '../components/ProgressBar'
import { Lock, ExternalLink, Globe, Share2, Music, AtSign } from 'lucide-react'

/* ── Mock Creator Data ── */
const creatorsData = {
  sarahchen: {
    name: 'Sarah Chen',
    bio: 'Digital artist creating illustrations, tutorials, and design resources. I share weekly art process videos and exclusive assets for my supporters.',
    category: 'Digital Art',
    supporters: 1247,
    goal: { current: 340, target: 500, label: 'New iPad Pro for drawing streams' },
    socials: { twitter: '#', instagram: '#', website: '#' },
  },
  alexrivera: {
    name: 'Alex Rivera',
    bio: 'Indie musician crafting lo-fi beats and ambient soundscapes. Every coffee helps me produce my next album.',
    category: 'Music',
    supporters: 892,
    goal: { current: 180, target: 300, label: 'Studio equipment upgrade' },
    socials: { twitter: '#', youtube: '#' },
  },
  jordanpark: {
    name: 'Jordan Park',
    bio: 'Fiction writer and poet. I publish weekly short stories and poetry for my supporters.',
    category: 'Writing',
    supporters: 634,
    goal: null,
    socials: { twitter: '#' },
  },
  mayajohnson: {
    name: 'Maya Johnson',
    bio: 'Host of "The Creative Hour" — a weekly podcast interviewing artists, designers, and creative entrepreneurs.',
    category: 'Podcasting',
    supporters: 2103,
    goal: { current: 450, target: 500, label: 'New podcast microphone setup' },
    socials: { twitter: '#', instagram: '#', youtube: '#' },
  },
}

const recentSupporters = [
  { name: 'Emily R.', message: 'Love your work! Keep creating amazing art! 🎨', amount: 15, time: '2 hours ago', cups: 3 },
  { name: 'Marcus T.', message: 'Your tutorials saved my portfolio. Thank you!', amount: 5, time: '5 hours ago', cups: 1 },
  { name: 'Anonymous', message: '', amount: 25, time: '1 day ago', cups: 5 },
  { name: 'Lily K.', message: 'Supporting your journey! Can\'t wait for more content.', amount: 10, time: '2 days ago', cups: 2 },
  { name: 'James W.', message: 'Incredible artist. Honored to support.', amount: 5, time: '3 days ago', cups: 1 },
]

const posts = [
  { title: 'Behind the scenes: My latest illustration process', preview: 'A deep dive into how I created the ocean sunset piece...', time: '3 days ago', membersOnly: false },
  { title: 'Exclusive: Full PSD files for January collection', preview: 'Download all 12 high-res illustration files...', time: '1 week ago', membersOnly: true },
  { title: 'Monthly Q&A Recap — Your questions answered', preview: 'Thank you for all the amazing questions this month...', time: '2 weeks ago', membersOnly: false },
  { title: 'Brush pack v3.0 — Premium Procreate brushes', preview: 'My custom brush pack updated with 15 new brushes...', time: '3 weeks ago', membersOnly: true },
]

const PRICE_PER_CUP = 5

export default function CreatorProfilePage() {
  const { username } = useParams()
  const creator = creatorsData[username]
  const [cupCount, setCupCount] = useState(1)
  const [customCups, setCustomCups] = useState('')
  const [supporterName, setSupporterName] = useState('')
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('supporters')
  const [priceAnimating, setPriceAnimating] = useState(false)

  const totalAmount = useMemo(() => {
    const cups = customCups ? parseInt(customCups) || 0 : cupCount
    return cups * PRICE_PER_CUP
  }, [cupCount, customCups])

  const handleCupSelect = (count) => {
    setCupCount(count)
    setCustomCups('')
    setPriceAnimating(true)
    setTimeout(() => setPriceAnimating(false), 300)
  }

  const handleCustomChange = (e) => {
    setCustomCups(e.target.value)
    setPriceAnimating(true)
    setTimeout(() => setPriceAnimating(false), 300)
  }

  // 404 for unknown creators
  if (!creator) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-7xl mb-6">☕💧</div>
        <h1 className="font-inter font-bold text-2xl md:text-3xl text-brew-text mb-3">
          Oops — this brew doesn't exist
        </h1>
        <p className="font-inter text-brew-muted mb-6">
          We couldn't find a creator with that username.
        </p>
        <a href="/">
          <Button variant="primary">Back to home</Button>
        </a>
      </div>
    )
  }

  const socialIcons = {
    twitter: AtSign,
    instagram: Share2,
    youtube: Music,
    website: Globe,
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 py-10 md:py-14">
      {/* ── Profile Header ── */}
      <div className="text-center mb-8 animate-fade-up">
        <Avatar name={creator.name} size="xl" className="mx-auto mb-4" />
        <h1 className="font-inter font-bold text-2xl text-brew-text mb-1">{creator.name}</h1>
        <Badge className="mb-3">{creator.category}</Badge>
        <p className="font-inter text-sm text-brew-muted leading-relaxed max-w-md mx-auto mb-4">
          {creator.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-2">
          {Object.entries(creator.socials).map(([key, url]) => {
            const Icon = socialIcons[key] || ExternalLink
            return (
              <a
                key={key}
                href={url}
                className="w-9 h-9 rounded-full bg-brew-yellow-light flex items-center justify-center text-brew-muted hover:text-brew-text hover:bg-brew-yellow/20 transition-colors no-underline"
                aria-label={key}
              >
                <Icon size={16} />
              </a>
            )
          })}
        </div>
      </div>

      {/* ── Support Widget ── */}
      <Card className="!p-6 mb-6 animate-fade-up delay-100 border-brew-yellow/20">
        <h2 className="font-inter font-bold text-lg text-brew-text mb-5 text-center">
          Buy {creator.name.split(' ')[0]} a coffee ☕
        </h2>

        {/* Cup Quantity Picker */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 3, 5].map((count) => {
            const isActive = !customCups && cupCount === count
            return (
              <button
                key={count}
                onClick={() => handleCupSelect(count)}
                className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-inter font-bold text-sm transition-all duration-150 cursor-pointer
                  ${isActive
                    ? 'border-brew-yellow bg-brew-yellow-light scale-110 ring-2 ring-brew-yellow/30'
                    : 'border-brew-border bg-white hover:border-brew-yellow hover:scale-105'
                  }`}
                aria-label={`${count} coffee${count > 1 ? 's' : ''}`}
              >
                <span className="text-lg leading-none">☕</span>
                <span className="text-[10px] text-brew-muted mt-0.5">×{count}</span>
              </button>
            )
          })}

          {/* Custom */}
          <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-150
            ${customCups ? 'border-brew-yellow bg-brew-yellow-light ring-2 ring-brew-yellow/30' : 'border-brew-border bg-white'}`}
          >
            <input
              type="number"
              min="1"
              max="100"
              value={customCups}
              onChange={handleCustomChange}
              placeholder="#"
              className="w-full h-full text-center font-inter font-bold text-sm bg-transparent outline-none text-brew-text placeholder:text-brew-muted/50"
              aria-label="Custom number of coffees"
            />
          </div>
        </div>

        {/* Dynamic Price */}
        <div className={`text-center mb-6 ${priceAnimating ? 'animate-pulse-price' : ''}`}>
          <span className="font-inter font-bold text-2xl text-brew-text">
            ${totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Optional Name & Message */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Name or @username (optional)"
            value={supporterName}
            onChange={(e) => setSupporterName(e.target.value)}
            className="w-full px-4 py-2.5 border border-brew-input-border rounded-input text-sm font-inter text-brew-text placeholder:text-brew-muted/50 focus:outline-none focus:border-brew-yellow focus:ring-1 focus:ring-brew-yellow transition-colors min-h-[44px]"
          />
          <textarea
            placeholder="Say something nice... (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-brew-input-border rounded-input text-sm font-inter text-brew-text placeholder:text-brew-muted/50 focus:outline-none focus:border-brew-yellow focus:ring-1 focus:ring-brew-yellow transition-colors resize-none"
          />
        </div>

        {/* Support CTA */}
        <Button variant="primary" className="w-full text-base py-3 gap-2">
          Support ${totalAmount.toFixed(2)} →
        </Button>

        <p className="text-center mt-3 font-inter text-xs text-brew-muted">
          🔒 Secured by Stripe · No account needed
        </p>
      </Card>

      {/* ── Goal Bar ── */}
      {creator.goal && (
        <Card className="!p-5 mb-6 animate-fade-up delay-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-inter font-medium text-sm text-brew-text">{creator.goal.label}</span>
            <span className="font-inter text-xs text-brew-muted">
              ${creator.goal.current} / ${creator.goal.target}
            </span>
          </div>
          <ProgressBar value={creator.goal.current} max={creator.goal.target} />
        </Card>
      )}

      {/* ── Tabs: Supporters / Posts / About ── */}
      <div className="flex border-b border-brew-border mb-6 animate-fade-up delay-300">
        {['supporters', 'posts', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 font-inter font-medium text-sm text-center capitalize transition-all cursor-pointer border-b-2
              ${activeTab === tab
                ? 'text-brew-text border-brew-yellow'
                : 'text-brew-muted border-transparent hover:text-brew-text'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'supporters' && (
          <div className="space-y-3">
            {recentSupporters.map((s, i) => (
              <Card key={i} className="!p-4 flex gap-3">
                <Avatar name={s.name} size="sm" className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-inter font-medium text-sm text-brew-text">{s.name}</span>
                    <span className="font-inter text-xs text-brew-muted">
                      {'☕'.repeat(Math.min(s.cups, 5))} · ${s.amount}
                    </span>
                  </div>
                  {s.message && (
                    <p className="font-inter text-sm text-brew-muted leading-relaxed">{s.message}</p>
                  )}
                  <span className="font-inter text-xs text-brew-muted/70">{s.time}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <Card key={i} hover className="!p-4 cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-inter font-bold text-sm text-brew-text">{post.title}</h3>
                      {post.membersOnly && (
                        <Lock size={12} className="text-brew-yellow-hover shrink-0" />
                      )}
                    </div>
                    <p className="font-inter text-xs text-brew-muted leading-relaxed">{post.preview}</p>
                    <span className="font-inter text-[10px] text-brew-muted/70 mt-1 block">{post.time}</span>
                  </div>
                  {post.membersOnly && (
                    <Badge className="shrink-0 text-[10px]">Members</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <Card className="!p-5">
            <h3 className="font-inter font-bold text-base text-brew-text mb-3">About {creator.name}</h3>
            <p className="font-inter text-sm text-brew-muted leading-relaxed mb-4">{creator.bio}</p>
            <div className="flex items-center gap-4 text-sm font-inter text-brew-muted">
              <span>☕ {creator.supporters.toLocaleString()} supporters</span>
              <span>·</span>
              <span>{creator.category}</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
