# Habib's Conversation-Driven Interface (CDI) Website

A personal website that transforms based on visitor intent detected through conversation.

## Concept

Instead of a static brochure site where visitors search for information, the interface morphs dynamically as visitors describe their challenges, showing relevant content, case studies, and CTAs contextually.

## Features

- **Dynamic Canvas System**: UI morphs based on detected intent (AI Strategy, Speaking, GTM, Market Expansion)
- **Intent Classification**: Rule-based intent detection with context extraction
- **Split Layout UX**: Canvas stays visible while conversation happens alongside
- **Case Study Deep Dives**: Full case study views with results and approach
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Canvas States

1. **Initial** - Hero with services overview
2. **AI Strategy** - Governance-first approach, ArqAI case study
3. **Speaking** - Topics, recent appearances, availability
4. **GTM** - Results metrics, capabilities, AML case study
5. **Market Expansion** - Regional expertise, RegTech case study
6. **Case Study** - Detailed view with challenge, approach, results

## Future Enhancements

- LLM integration (Claude/GPT) for generative responses
- Calendar integration (Cal.com)
- CRM webhook integration
- Analytics and A/B testing
