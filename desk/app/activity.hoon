::
/-  a=activity, c=channels
/+  default-agent, verb, dbug
::  build for performance
/+  activity-json
::
=>
  |%
  +$  card  card:agent:gall
  ::
  +$  versioned-state
    $%  state-0
    ==
  ::
  +$  state-0
    [%0 =stream:a =indices:a =volume-settings:a]
  --
::
=|  state-0
=*  state  -
::
%-  agent:dbug
%+  verb  |
^-  agent:gall
::
=<
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      cor   ~(. +> [bowl ~])
  ::
  ++  on-init
    =^  cards  state
      abet:init:cor
    [cards this]
  ::
  ++  on-save  !>(state)
  ::
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =^  cards  state
      abet:(load:cor vase)
    [cards this]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:cor mark vase)
    [cards this]
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state
      abet:(watch:cor path)
    [cards this]
  ::
  ++  on-arvo    on-arvo:def
  ++  on-agent   on-agent:def
  ++  on-peek    peek:cor
  ++  on-leave   on-leave:def
  ++  on-fail    on-fail:def
  --
|_  [=bowl:gall cards=(list card)]
++  abet  [(flop cards) state]
++  cor   .
++  emit  |=(=card cor(cards [card cards]))
++  emil  |=(caz=(list card) cor(cards (welp (flop caz) cards)))
++  give  |=(=gift:agent:gall (emit %give gift))
++  from-self  =(our src):bowl
::
++  init
  ^+  cor
  cor
::
++  load
  |=  =vase
  ^+  cor
  =+  !<(old=versioned-state vase)
  ?>  ?=(%0 -.old)
  =.  state  old
  cor
::
:: ++  channels-prefix  /(scot %p our.bowl)/channels/(scot %da now.bowl)/v1
:: ++  set-reads-from-old
::   =.  cor
::     =+  .^(=unreads:c %gx (welp channels-prefix /unreads/noun))
::     =+  .^(=channels:c %gx (welp channels-prefix /channels/noun))
::     =/  entries  ~(tap by unreads)
::     |-
::     =/  head  i.entries
::     =+  next  $(entries t.entries)
::     ?~  head  cor
::     =/  [=nest:c =unread:c]  head
::     =/  channel  (~(get by channels) nest)
::     ?^  unread.unread
::       ?~  channel  next
::       =/  path
::         ;:  welp
::           channels-prefix
::           /[kind.nest]/(scot %p ship.nest)/[name.nest]
::           /posts/post/(scot %ud id.u.unread.unread)/noun
::         ==
::       =+  .^(post=(unit post:c) %gx path)
::       ?~  post  next
::       =/  =post-concern:a
::         [[[author.u.post id.u.post] id.u.post] nest group.perm.channel]
::       =.  stream  (put:on-event:a *stream:a id.u.post [%post post-concern ~ |])
::       next
::     =/  path
::         ;:  welp
::           channels-prefix
::           /[kind.nest]/(scot %p ship.nest)/[name.nest]
::           /posts/newest/1/outline/noun
::         ==
::     =+  .^(=posts:c %gx path)
::     =/  entry=(unit [time post:c])  (ram:on-posts:c posts)
::     ?~  entry  next
++  poke
  |=  [=mark =vase]
  ^+  cor
  ?+  mark  ~|(bad-poke+mark !!)
      %activity-action
    =+  !<(=action:a vase)
    ?-  -.action
      %add     (add +.action)
      %read    (read +.action)
      %adjust  (adjust +.action)
    ==
  ==
::
++  watch
  |=  =(pole knot)
  ^+  cor
  ?+  pole  ~|(bad-watch-path+pole !!)
    ~  ?>(from-self cor)
    [%notifications ~]  ?>(from-self cor)
    [%unreads ~]  ?>(from-self cor)
  ==
::
++  peek
  |=  =(pole knot)
  ^-  (unit (unit cage))
  ?+  pole  [~ ~]
      [%x ~]
    ``activity-full+!>([stream indices (~(run by indices) summarize-unreads)])
  ::
  ::  /all: unified feed (equality of opportunity)
  ::
      [%x %all ~]
    ``activity-stream+!>((tap:on-event:a stream))
  ::
      [%x %all start=@ count=@ ~]
    =-  ``activity-stream+!>(-)
    (tab:on-event:a stream `(slav %da start.pole) (slav %ud count.pole))
  ::
  ::  /each: unified feed (equality of outcome)
  ::TODO  want to be able to filter for specific events kind too, but that will
  ::      suffer from the "search range" "problem", where we want .count to
  ::      mean entries trawled, not entries returned...
  ::
      [%x %each start=@ count=@ ~]
    =;  =stream:a
      ``activity-stream+!>((tap:on-event:a -))
    =/  start  (slav %da start.pole)
    =/  count  (slav %ud count.pole)
    %-  ~(rep by indices)
    |=  [[=source:a =stream:a =reads:a] out=stream:a]
    ^+  out
    ::REVIEW  key overlaps possible?
    (gas:on-event:a out (tab:on-event:a stream `start count))
  ::
  ::  /indexed: per-index
  ::
      [%x %indexed concern=?([%channel nk=kind:c:a ns=@ nt=@ gs=@ gt=@ rest=*] [%dm whom=@ rest=*])]
    =/  =source:a
      ?-  -.concern.pole
          %dm
        :-  %dm
        ?^  ship=(slaw %p whom.concern.pole)
          [%ship u.ship]
        [%club (slav %uv whom.concern.pole)]
      ::
          %channel
        =,  concern.pole
        [%channel [nk (slav %p ns) nt]]
      ==
    =/  rest=(^pole knot)
      ?-  -.concern.pole
        %dm       rest.concern.pole
        %channel  rest.concern.pole
      ==
    ?~  dice=(~(get by indices) source)  [~ ~]
    ?+  rest  ~
        ~
      ``activity-stream+!>((tap:on-event:a stream.u.dice))
    ::
        [start=@ count=@ ~]
      =/  start  (slav %da start.rest)
      =/  count  (slav %ud count.rest)
      ``activity-stream+!>((tab:on-event:a stream.u.dice `start count))
    ==
  ::  /event: individual events
  ::
      [%u %event id=@ ~]
    ``loob+!>((has:on-event:a stream (slav %da id.pole)))
  ::
      [%x %event id=@ ~]
    ``activity-event+!>([id.pole (got:on-event:a stream (slav %da id.pole))])
  ::
      [%x %unreads ~]
    ``activity-unreads+!>((~(run by indices) summarize-unreads))
  ==
::
++  add
  |=  =event:a
  ^+  cor
  =/  =time-id:a
    =/  t  now.bowl
    |-
    ?.  (has:on-event:a stream t)  t
    $(t +(t))
  =.  cor
    (give %fact ~[/] activity-update+!>([%added time-id event]))
  =?  cor  (notifiable event)
    (give %fact ~[/notifications] activity-event+!>([time-id event]))
  =.  stream
    (put:on-event:a stream time-id event)
  ?+  -.event  cor
      %dm-post
    =/  source  [%dm whom.event]
    =?  indices  !(~(has by indices) source)
      (~(put by indices) source [*stream:a *reads:a])
    =/  indy  (~(got by indices) source)
    =/  new
      :*  (put:on-event:a stream.indy time-id event)
          floor.reads.indy
          %^  put:on-post-reads:a  posts.reads.indy
            time-id
          [| time-id]
      ==
    =.  cor  (give-unreads source new)
    =.  indices
      (~(put by indices) source new)
    cor
      %dm-reply
    =/  source  [%dm whom.event]
    =?  indices  !(~(has by indices) source)
      (~(put by indices) source *[stream:a reads:a])
    =/  indy  (~(got by indices) source)
    =/  new
      :-  (put:on-event:a stream.indy time-id event)
      reads.indy
    =.  cor  (give-unreads source new)
    =.  indices
      (~(put by indices) source new)
    cor
      %post
    =/  source  [%channel channel.event]
    =?  indices  !(~(has by indices) source)
      (~(put by indices) source *[stream:a reads:a])
    =/  indy  (~(got by indices) source)
    =/  new
      :*  (put:on-event:a stream.indy time-id event)
          floor.reads.indy
          %^  put:on-post-reads:a  posts.reads.indy
            time-id
          [| time-id]
      ==
    =.  cor  (give-unreads source new)
    =.  indices
      (~(put by indices) source new)
    cor
      %reply
    =/  source  [%channel channel.event]
    =?  indices  !(~(has by indices) source)
      (~(put by indices) source *[stream:a reads:a])
    =/  indy  (~(got by indices) source)
    =/  new
      :-  (put:on-event:a stream.indy time-id event)
      reads.indy
    =.  cor  (give-unreads source new)
    =.  indices
      (~(put by indices) source new)
    cor
  ==
++  loudness
  ^-  (map event-type:a notify-level:a)
  %-  malt
  ^-  (list [event-type:a notify-level:a])
  :~  [%post %default]
      [%post-mention %notify]
      [%reply %notify]
      [%reply-mention %notify]
      [%dm-invite %notify]
      [%dm-post %notify]
      [%dm-post-mention %notify]
      [%dm-reply %notify]
      [%dm-reply-mention %notify]
      [%group-invite %notify]
      [%group-ask %notify]
      [%group-kick %default]
      [%group-join %default]
      [%group-role %default]
      [%flag-post %default]
      [%flag-reply %default]
  ==
++  notifiable
  |=  =event:a
  ^-  ?
  =/  source  (determine-index event)
  =/  =volume:a
    ?~  source  %soft
    (~(gut by volume-settings) u.source %soft)
  ?-  volume
      %loud  &
      %hush  |
      %soft  |
      %default
    .=  %notify
    (~(gut by loudness) (determine-event-type event) %default)
  ==
++  determine-index
  |=  =event:a
  ^-  (unit source:a)
  ?+  -.event  ~
    %post      `[%channel channel.event]
    %reply     `[%channel channel.event]
    %dm-post   `[%dm whom.event]
    %dm-reply  `[%dm whom.event]
  ==
++  determine-event-type
  |=  =event:a
  ^-  event-type:a
  ?+  -.event  -.event
      %post      ?:(mention.event %post-mention %post)
      %reply     ?:(mention.event %reply-mention %reply)
      %dm-post   ?:(mention.event %dm-post-mention %dm-post)
      %dm-reply  ?:(mention.event %dm-reply-mention %dm-reply)
  ==
::
++  find-floor
  |=  [=source:a mode=$%([%all ~] [%reply parent=time-id:a])]
  ^-  (unit time)
  ?.  (~(has by indices) source)  ~
  ::  starting at the last-known first-unread location (floor), walk towards
  ::  the present, to find the new first-unread location (new floor)
  ::
  =/  [orig=stream:a =reads:a]
    (~(got by indices) source)
  ?>  |(?=(%all -.mode) (has:on-post-reads:a posts.reads parent.mode))
  ::  slice off the earlier part of the stream, for efficiency
  ::
  =/  =stream:a
    =;  beginning=time
      (lot:on-event:a orig `beginning ~)
    ?-  -.mode
        %all    floor.reads
        %reply  floor:(got:on-post-reads:a posts.reads parent.mode)
    ==
  =|  new-floor=(unit time)
  |-
  ?~  stream  new-floor
  ::
  =/  [[=time =event:a] rest=stream:a]  (pop:on-event:a stream)
  ?:  ?&  ?=(%reply -.mode)
      ?|  !?=(%reply -.event)
          ?&(?=(?(%dm-post %post) -.event) =(key.event parent.mode))
      ==  ==
    ::  we're in reply mode, and it's not a reply event, or a reply to
    ::  something else, so, skip
    ::
    $(stream rest)
  =;  is-read=?
    ::  if we found something that's unread, we need look no further
    ::
    ?.  is-read  $(stream ~)
    ::  otherwise, continue our walk towards the present
    ::
    $(new-floor `time, stream rest)
  ?+  -.event  !!
      ?(%dm-post %post)
    =*  id=time-id:a  q.id.key.event
    =/  par=(unit post-read:a)  (get:on-post-reads:a posts.reads id)
    ?~(par | seen.u.par)
  ::
      %reply
    =*  id=time-id:a  q.id.key.event
    =/  par=(unit post-read:a)  (get:on-post-reads:a posts.reads id)
    ?~(par | (gte time floor.u.par))
  ==
::
++  update-floor
  |=  =source:a
  ^+  cor
  =/  new-floor=(unit time)  (find-floor source %all ~)
  =?  indices  ?=(^ new-floor)
    %+  ~(jab by indices)  source
    |=  [=stream:a =reads:a]
    [stream reads(floor u.new-floor)]
  cor
::
++  read
  |=  [=source:a action=read-action:a]
  ^+  cor
  ?-  -.action
      %thread
    =/  indy  (~(get by indices) source)
    ?~  indy  cor
    =/  new
      =-  u.indy(posts.reads -)
      %+  put:on-post-reads:a  posts.reads.u.indy
      =;  new-floor=(unit time)
        [id.action [& (fall new-floor id.action)]]
      (find-floor source %reply id.action)
    =.  indices
      (~(put by indices) source new)
    =.  cor  (update-floor source)
    (give-unreads source new)
  ::
      %post
    =/  indy  (~(get by indices) source)
    ?~  indy  cor
    =/  old-post-read  (get:on-post-reads:a posts.reads.u.indy id.action)
    ?~  old-post-read  cor
    =/  new
      =-  u.indy(posts.reads -)
      %+  put:on-post-reads:a  posts.reads.u.indy
      [id.action u.old-post-read(seen &)]
    =.  indices
      (~(put by indices) source new)
    =.  cor  (update-floor source)
    (give-unreads source new)
  ::
      %all
    =/  indy  (~(get by indices) source)
    ?~  indy  cor
    =/  new
      =/  latest=(unit [=time event:a])
        ::REVIEW  is this taking the item from the correct end? lol
        (ram:on-event:a stream.u.indy)
      ?~  latest  u.indy
      u.indy(reads [time.u.latest ~])
    =.  indices
      (~(put by indices) source new)
    (give-unreads source new)
  ==
::
++  give-unreads
  |=  [=source:a =stream:a =reads:a]
  ^+  cor
  (give %fact ~[/ /unreads] activity-update+!>(`update:a`[%read source (summarize-unreads [stream reads])]))
::
++  adjust
  |=  [=source:a =volume:a]
  ^+  cor
  =.  volume-settings
    (~(put by volume-settings) source volume)
  cor
::
++  summarize-unreads
  |=  [=stream:a =reads:a]
  ^-  unread-summary:a
  =.  stream  (lot:on-event:a stream `floor.reads ~)
  =/  post-reads  posts.reads
  ::  for each item in reads
  ::  remove the post from the event stream
  ::  remove replies older than floor from the event stream
  ::  then call stream-to-unreads
  |-
  ?~  post-reads
    (stream-to-unreads stream floor.reads)
  =/  [[=time =post-read:a] rest=post-reads:a]  (pop:on-post-reads:a post-reads)
  %=  $
      post-reads
    rest
  ::
      stream
    =-  +.-
    %^  (dip:on-event:a @)  stream
      ~
    |=  [@ key=@da =event:a]
    ^-  [(unit event:a) ? @]
    ?>  ?=(?(%post %reply %dm-post) -.event)
    ?:  &(seen.post-read =(time key))
      [~ | ~]
    ?.  =(-.event %reply)
      [`event | ~]
    ?:  (lth time.key.event floor.post-read)
      [~ | ~]
    [`event | ~]
  ==
++  stream-to-unreads
  |=  [=stream:a floor=time]
  ^-  unread-summary:a
  =/  newest=time  floor
  =/  count  0
  =|  last=(unit message-key:a)
  =/  threads=unread-threads:a  ~
  ::  for each event
  ::  update count and newest
  ::  if reply, update thread state
  |-
  ?~  stream
    =/  unread  ?~(last ~ `[u.last count])
    [newest count unread threads]
  =/  [[@ =event:a] rest=stream:a]  (pop:on-event:a stream)
  ?>  ?=(?(%dm-post %dm-reply %post %reply) -.event)
  =.  count  +(count)
  =.  newest  time.key.event
  =.  last
    ?:  ?=(?(%reply %dm-reply) -.event)  last
    ?~  last  `key.event
    ?:  (gte time.key.event time.u.last)  last
    `key.event
  =?  threads  ?=(?(%reply %dm-reply) -.event)
    =/  old
      %+  ~(gut by threads)  parent.event
      [key.event count=0]
    %+  ~(put by threads)  parent.event
    ::  we don't need to update the timestamp, because we always process the
    ::  oldest message first
    ::
    [[id.old time.old] +(count.old)]
  $(stream rest)
--
