@app
cogs-kings-of-war

@aws
region eu-west-2
runtime nodejs20.x
policies
  arn:aws:iam::296681679694:policy/SESSendOnly
  architect-default-policies

@http
/*
  method any
  src server

@static

@tables
user
  email *String
  encrypt true

password
  email *String
  encrypt true

session
  sessionId *String
  ttl **Number

attendee
  eventSlug *String
  email **String
  encrypt true

upload
  id *String
  encrypt true

playerGame
  eventRound *String
  attendeeSlug **String
  encrypt true

tournament
  slug *String
  encrypt true

@tables-indexes
attendee
  email *String
  projection all
  name byEmail

attendee
  eventSlug *String
  slug **String
  projection all
  name bySlugs

playerGame
  eventRound *String
  tableNumber **Number
  projection all
  name byRoundTable

playerGame
  eventSlug *String
  attendeeSlug **String
  projection all
  name byEventAttendee

@env
SESSION_SECRET your-strong-random-secret-value
