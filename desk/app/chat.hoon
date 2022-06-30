/-  c=chat, g=groups
/-  meta
/-  ha=hark-store
/+  default-agent, verb, dbug
/+  chat-json
/+  w=chat-writs
/+  pac=dm
/+  ch=chat-hark
^-  agent:gall
=>
  |%
  +$  card  card:agent:gall
  ++  def-flag  `flag:c`[~zod %test]
  ++  club-eq  2 :: reverb control: max number of forwards for clubs
  +$  state-0
    $:  %0
        chats=(map flag:c chat:c)
        dms=(map ship dm:c)
        clubs=(map id:club:c club:c)
        drafts=(map whom:c story:c)
        bad=(set ship)
        inv=(set ship)
    ==
  --
=|  state-0
=*  state  -
=< 
  %+  verb  &
  %-  agent:dbug
  |_  =bowl:gall
  +*  this  .
      def   ~(. (default-agent this %|) bowl)
      cor   ~(. +> [bowl ~])
  ++  on-init  
    ^-  (quip card _this)
    =^  cards  state
      abet:init:cor
    [cards this]
  ::
  ++  on-save  !>(state)
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =/  old=(unit state-0)
      (mole |.(!<(state-0 vase)))  
    ?^  old  
      =.  dms.u.old
        %-  ~(run by dms.u.old)
        |=  =dm:c
        dm(watching.remark &)
      `this(state u.old)
    ~&  >>>  "Incompatible load, nuking"
    =^  cards  this  on-init
    :_  this
    =-  (welp - cards)
    %+  turn  ~(tap in ~(key by wex.bowl))
    |=  [=wire =ship =term] 
    ^-  card
    [%pass wire %agent [ship term] %leave ~]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^  cards  state
      abet:(poke:cor mark vase)
    [cards this]
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state
      abet:(watch:cor path)
    [cards this]
  ::
  ++  on-peek   peek:cor
  ::
  ++  on-leave   on-leave:def
  ++  on-fail    on-fail:def
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    =^  cards  state
      abet:(agent:cor wire sign)
    [cards this]
  ++  on-arvo
    |=  [=wire sign=sign-arvo]
    ^-  (quip card _this)
    =^  cards  state
      abet:(arvo:cor wire sign)
    [cards this]
  --
|_  [=bowl:gall cards=(list card)]
++  abet  [(flop cards) state]
++  cor   .
++  emit  |=(=card cor(cards [card cards]))
++  emil  |=(caz=(list card) cor(cards (welp (flop caz) cards)))
++  give  |=(=gift:agent:gall (emit %give gift))
++  now-id   `id:c`[our now]:bowl
++  init
  ^+  cor
  watch-groups
::
++  watch-groups
  ^+  cor
  (emit %pass /groups %agent [our.bowl %groups] %watch /groups)
::
++  poke
  |=  [=mark =vase]
  |^  ^+  cor 
  ?+    mark  ~|(bad-poke/mark !!)
      %dm-rsvp
    =+  !<(=rsvp:dm:c vase)
    di-abet:(di-rsvp:(di-abed:di-core ship.rsvp) ok.rsvp)
      %dm-pin
    =+  !<([=ship pin=?] vase)
    di-abet:(di-pin:(di-abed:di-core ship) pin)
  ::
      %flag
    =+  !<(=flag:c vase)
    ?<  =(our.bowl p.flag)
    (join flag)
  ::
      %chat-draft
    =+  !<(=draft:c vase)
    ?>  =(src.bowl our.bowl)
    %_  cor
        drafts
       (~(put by drafts) p.draft q.draft)
    ==
  ::
      %chat-create
    =+  !<(req=create:c vase)
    (create req)
  ::
      %chat-action
    =+  !<(=action:c vase)
    =.  p.q.action  now.bowl
    =/  chat-core  (ca-abed:ca-core p.action)
    ?:  =(p.p.action our.bowl)
      ca-abet:(ca-update:chat-core q.action)
    ca-abet:(ca-proxy:chat-core q.action)
  ::
      %chat-remark-action
    =+  !<(act=remark-action:c vase)
    ?-  -.p.act
      %ship  di-abet:(di-remark-diff:(di-abed:di-core p.p.act) q.act)
      %flag  ca-abet:(ca-remark-diff:(ca-abed:ca-core p.p.act) q.act)
      %club  cor  :: TODO
    ==
  ::
      %dm-action
    =+  !<(=action:dm:c vase)
    di-abet:(di-proxy:(di-abed-soft:di-core p.action) q.action)
  ::
      %dm-diff
    =+  !<(=diff:dm:c vase)
    di-abet:(di-take-counter:(di-abed-soft:di-core src.bowl) diff)
  ::
      %club-create
    cu-abet:(cu-create:cu-core !<(=create:club:c vase))
  ::
      %club-action
    =+  !<(=action:club:c vase)
    =/  cu  (cu-abed p.action)
    cu-abet:(cu-diff:cu q.action)
  ::
      %dm-archive  di-abet:di-archive:(di-abed:di-core !<(ship vase))
  ==
  ++  join
    |=  =flag:c
    ^+  cor
    =.  chats  (~(put by chats) flag *chat:c)
    ca-abet:(ca-join:ca-core flag)
  ::
  ++  create
    |=  req=create:c
    ^+  cor
    =/  =flag:c  [our.bowl name.req]
    =|  =chat:c
    =/  =perm:c  [~ group.req]
    =.  perm.chat  perm
    =.  net.chat  [%pub ~]
    =.  chats  (~(put by chats) flag chat)
    ca-abet:(ca-init:(ca-abed:ca-core flag) req)
  --
++  watch
  |=  =path
  ^+  cor
  ?+    path  ~|(bad-watch-path/path !!)
      [%briefs ~]  ?>(from-self cor)
      [%chat ~]  ?>(from-self cor)
      [%dm %invited ~]  ?>(from-self cor)
    ::
      [%chat @ @ *]
    =/  =ship  (slav %p i.t.path)
    =*  name   i.t.t.path
    ca-abet:(ca-watch:(ca-abed:ca-core ship name) t.t.t.path)
  ::
      [%dm @ *]
    =/  =ship  (slav %p i.t.path)
    di-abet:(di-watch:(di-abed:di-core ship) t.t.path)
  ::
      [%club @ *]
    =/  =id:club:c  (slav %uv i.t.path)
    cu-abet:(cu-watch:(cu-abed id) t.t.path)
  ==
::
++  agent
  |=  [=wire =sign:agent:gall]
  ^+  cor
  ?+    wire  ~|(bad-agent-wire/wire !!)
  ::
      [%dm @ *]
    =/  =ship  (slav %p i.t.wire)
    di-abet:(di-agent:(di-abed:di-core ship) t.t.wire sign)
  ::
      [%club @ *]
    =/  =id:club:c  (slav %uv i.t.wire)
    cu-abet:(cu-agent:(cu-abed id) t.t.wire sign)

      [%chat @ @ *]
    =/  =ship  (slav %p i.t.wire)
    =*  name   i.t.t.wire
    ca-abet:(ca-agent:(ca-abed:ca-core ship name) t.t.t.wire sign)
  ::
      [%groups ~]
    ?+    -.sign  !!
      %kick  watch-groups
    ::
        %watch-ack
      %.  cor
      ?~  p.sign  same
      =/  =tank
        leaf/"Failed groups subscription in {<dap.bowl>}, unexpected"
      (slog tank u.p.sign)
    ::
        %fact
      ?.  =(%group-action p.cage.sign)  cor
      (take-groups !<(=action:g q.cage.sign))
    ==
  ==
::  TODO: more efficient?
::    perhaps a cached index of (jug group=flag chat=flag)
++  take-groups
  |=  =action:g
  =/  affected=(list flag:c)
    %+  murn  ~(tap by chats)
    |=  [=flag:c =chat:c]
    ?.  =(p.action group.perm.chat)  ~
    `flag
  ?+    q.q.action  cor
      [%fleet @ %del ~]
    ~&  'revoke perms for'
    %+  roll  affected
    |=  [=flag:c co=_cor]
    ^+  cor
    %+  roll  ~(tap in p.q.q.action)
    |=  [=ship ci=_cor]
    ^+  cor
    =/  ca  (ca-abed:ca-core:ci flag)
    ca-abet:(ca-revoke:ca ship)
  ::
      [%fleet @ %del-sects *]
    ~&  'recheck permissions'
    %+  roll  affected
    |=  [=flag:c co=_cor]
    =/  ca  (ca-abed:ca-core:co flag)
    ca-abet:ca-recheck:ca
  ::
      [%channel * %del-sects *]
    ~&  'recheck permissions'
    %+  roll  affected
    |=  [=flag:c co=_cor]
    =/  ca  (ca-abed:ca-core:co flag)
    ca-abet:ca-recheck:ca
  ==
::
++  arvo
  |=  [=wire sign=sign-arvo]
  ^+  cor
  ~&  arvo/wire
  cor
++  peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  [~ ~]
  ::
    [%x %chat ~]  ``flags+!>(~(key by chats))
  ::
      [%x %chat @ @ *]
    =/  =ship  (slav %p i.t.t.path)
    =*  name   i.t.t.t.path
    (ca-peek:(ca-abed:ca-core ship name) t.t.t.t.path)
  ::
      [%x %dm ~]
    ``ships+!>(~(key by accepted-dms))
  ::
      [%x %dm %invited ~]
    ``ships+!>(~(key by pending-dms))
  ::
      [%x %dm %pinned ~]
    =-  ``ships+!>(-)
    ^-  (set ship)
    %-  silt
    %+  murn  ~(tap by dms)
    |=  [=ship =dm:c]
    ?.  pin.dm  ~
    `ship
  ::
      [%x %dm %archive ~]
    ``ships+!>(~(key by archived-dms))
  ::
      [%x %dm @ *]
    =/  =ship  (slav %p i.t.t.path)
    (di-peek:(di-abed:di-core ship) t.t.t.path)
  ::
      [%x %club @ *]
    (cu-peek:(cu-abed (slav %uv i.t.t.path)) t.t.t.path)
  ::
      [%x %draft @ $@(~ [@ ~])]
    =/  =whom:c
      ?^  t.t.t.path
        flag+[(slav %p i.t.t.path) i.t.t.t.path]
      %+  rash
      i.t.t.path
    ;~  pose
      (stag %ship ;~(pfix sig fed:ag))
      (stag %club club-id-rule:dejs:chat-json)
    ==
    =-  ``chat-draft+!>(-)
    `draft:c`[whom (~(gut by drafts) whom *story:c)]
  ::
      [%x %briefs ~]
    =-  ``chat-briefs+!>(-)
    ^-  briefs:c
    %-  ~(gas by *briefs:c)
    %+  welp
      %+  turn  ~(tap in ~(key by clubs))
      |=  =id:club:c
      =/  cu  (cu-abed id)
      [club/id cu-brief:cu]
    %+  welp  
      %+  murn  ~(tap in ~(key by dms))
      |=  =ship
      =/  di  (di-abed:di-core ship)
      ?:  ?=(?(%invited %archive) net.dm.di)  ~
      ?:  =([~ ~] pact.dm.di)  ~
      `[ship/ship di-brief:di]
    %+  turn  ~(tap in ~(key by chats))
    |=  =flag:c
    :-  flag/flag
    ca-brief:(ca-abed:ca-core flag)
  ==
::
++  give-brief
  |=  [=whom:c =brief:briefs:c]
  (give %fact ~[/briefs] chat-brief-update+!>([whom brief]))
::
++  from-self  =(our src):bowl
++  cu-abed  cu-abed:cu-core
::
++  cu-core
  |_  [=id:club:c =club:c gone=_|]
  +*  cu-pact  ~(. pac pact.club)
  ++  cu-core  .
  ++  cu-abet  
  =.  clubs
    ?:  gone
      (~(del by clubs) id)
    (~(put by clubs) id club)
  cor
  ++  cu-abed
    |=  i=id:club:c
    ~|  no-club/i
    cu-core(id i, club (~(gut by clubs) i *club:c))
  ++  cu-out  (~(del in cu-circle) our.bowl)
  ++  cu-circle
    (~(uni in team.club) hive.club)
  ::
  ++  cu-area  `wire`/club/(scot %uv id)
  ::
  ++  cu-pass
    |%
    ++  act
      |=  [=ship =diff:club:c]
      ^-  card
      =/  =wire  (snoc cu-area %gossip)
      =/  =dock  [ship dap.bowl]
      =/  =cage  club-action+!>(`action:club:c`[id diff])
      [%pass wire %agent dock %poke cage]
    ::
    ++  gossip
      |=  =diff:club:c
      ^-  (list card)
      %+  turn  ~(tap in cu-out)
      |=  =ship
      (act ship diff)
    --
  ::
  ++  cu-init
    |=  [=net:club:c =create:club:c]
    =/  clab=club:c
      [*pact:c (silt our.bowl ~) hive.create *data:meta net]
    cu-core(id id.create, club clab)
  ::
  ++  cu-brief  (brief:cu-pact [our now]:bowl)
  ::
  ++  cu-create  
    |=  =create:club:c 
    ~&  id/id.create
    =.  cu-core  (cu-init %done create)
    =.  cu-core  (cu-diff 0 [%init team hive met]:club)
    =/  =notice:c
      :-  ''
      (rap 3 ' started a group chat with ' (scot %ud ~(wyt in hive.create)) ' other members' ~)
    =.  cor  (give-brief club/id cu-brief)
    =.  cu-core
      (cu-diff 0 [%writ now-id %add ~ our.bowl now.bowl notice/notice])
    cu-core
  ::
  ++  cu-invite  
    |=  =invite:club:c 
    (cu-init %invited invite)
  ::
  ::  NB: need to be careful not to forward automatically generated
  ::  messages like this, each node should generate its own notice
  ::  messages, and never forward. XX: defend against?
  ++  cu-post-notice
    |=  [=ship =notice:c]
    =/  =id:c
      [ship now.bowl]
    =/  w-d=diff:writs:c  [id %add ~ ship now.bowl notice/notice]
    =/  del=delta:club:c
      [%writ w-d] 
    =.  pact.club  (reduce:cu-pact now.bowl w-d)
    (cu-give-delta del)
  ::
  ++  cu-give-delta
    |=  =delta:club:c
    =.  cor
      =/  =cage  club-delta+!>(delta)
      (emit %give %fact ~[(snoc cu-area %ui)] cage)
    cu-core
  ::
  ++  cu-diff
    |=  [=echo:club:c =delta:club:c]
    ::  ?>  (~(has in cu-circle) src.bowl)  :: TODO: signatures?? probably overkill
    =?  cor  (lth echo club-eq)
      (emil (gossip:cu-pass +(echo) delta))
    =.  cu-core  (cu-give-delta delta)
    ?-    -.delta
    ::
        %init
      =:  hive.club  hive.delta
          team.club  team.delta
          met.club   met.delta
        ==
      cu-core
    ::
        %meta
      =.  met.club  meta.delta
      cu-core
    ::
        %writ
      =.  pact.club  (reduce:cu-pact now.bowl diff.delta)
      cu-core
    ::
        %team
      =*  ship  ship.delta
      ?:  &(!ok.delta (~(has in team.club) ship))
        ?.  =(our src):bowl
          cu-core
        cu-core(gone &)
      ?.  (~(has in hive.club) ship)
        cu-core
      =.  hive.club  (~(del in hive.club) ship)
      ?.  ok.delta
        (cu-post-notice ship '' ' declined the invite')
      =.  team.club  (~(put in team.club) ship)
      (cu-post-notice ship '' ' joined the chat')
    ::
        %hive
      ?:  add.delta
        ?:  (~(has in hive.club) for.delta)
          cu-core
        =.  hive.club   (~(put in hive.club) for.delta)
        =.  cor
          (emit (act:cu-pass for.delta club-eq %init [team hive met]:club))
        :: TODO include inviter's name in message? requires rework of
        :: notice messages though :(
        (cu-post-notice for.delta '' ' was invited to the chat') 
      ?.  (~(has in hive.club) for.delta)
        cu-core
      =.  hive.club  (~(del in hive.club) for.delta)
      (cu-post-notice for.delta '' ' was uninvited from the chat') 
    ==
  ::
  ++  cu-peek
    |=  =path
    ^-  (unit (unit cage))
    ?+  path  [~ ~]
      [%writs *]  (peek:cu-pact t.path)
      [%crew ~]   ``club-crew+!>(+.club)
    ==
  ::
  ++  cu-watch
    |=  =path
    ^+  cu-core
    ?>  =(src our):bowl
    ?+  path  !!
      [%ui ~]  cu-core
      [%ui %writs ~]  cu-core
    ==
  ::
  ++  cu-agent
    |=  [=wire =sign:agent:gall]
    ^+  cu-core
    ?+    wire  ~|(bad-club-take/wire !!)
        [%gossip ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  cu-core
      ::  TODO: handle?
      %-  (slog leaf/"Failed to gossip {<src.bowl>} {<id>}" u.p.sign)
      cu-core
    ==
  ::
  --
::
++  ca-core
  |_  [=flag:c =chat:c gone=_|]
  +*  ca-pact  ~(. pac pact.chat)
  ++  ca-core  .
  ::  TODO: archive??
  ++  ca-abet  
    %_  cor
        chats  
      ?:(gone (~(del by chats) flag) (~(put by chats) flag chat))
    ==
  ++  ca-abed
    |=  f=flag:c
    ca-core(flag f, chat (~(got by chats) f))
  ++  ca-area  `path`/chat/(scot %p p.flag)/[q.flag]
  ++  ca-watch
    |=  =path
    ^+  ca-core
    ?+    path  !!
      [%updates *]    (ca-pub t.path)
      [%ui ~]         ?>(from-self ca-core)
      [%ui %writs ~]       ?>(from-self ca-core)
    ::
    ==
  ++  ca-pass
    |%
    ++  add-channel
      |=  req=create:c
      =/  =dock      [p.group.req %groups]
      =/  =channel:g  
        =,(req [[title description '' ''] now.bowl ~ readers])
      =/  =action:g  [group.req now.bowl %channel flag %add channel]
      =/  =cage      group-action+!>(action)
      =/  =wire      (snoc ca-area %create)
      =/  =card
        [%pass ca-area %agent dock %poke cage]
      =.  cor
        (emit card)
      ca-core
    --
  ++  ca-init
    |=  req=create:c
    =/  =perm:c  [~ group.req]
    =.  ca-core  (ca-update now.bowl %create perm)
    (add-channel:ca-pass req)
  ::
  ++  ca-agent
    |=  [=wire =sign:agent:gall]
    ^+  ca-core
    ?+  wire  !!
        ~  :: noop wire, should only send pokes
      ca-core
    ::
        [%updates ~]
      (ca-take-update sign)
    ::
        [%create ~]
      ?>  ?=(%poke-ack -.sign)
      %.  ca-core  :: TODO rollback creation if poke fails?
      ?~  p.sign  same
      (slog leaf/"poke failed" u.p.sign)
    ==
  ::
  ++  ca-brief  (brief:ca-pact our.bowl last-read.remark.chat)
  ::
  ++  ca-peek
    |=  =(pole knot)
    ^-  (unit (unit cage))
    ?+  pole  [~ ~]
      [%writs rest=*]  (peek:ca-pact rest.pole)
      [%perm ~]        ``chat-perm+!>(perm.chat)
    ==
  ::
  ++  ca-revoke
    |=  her=ship
    %+  roll  ~(tap in ca-subscriptions)
    |=  [[=ship =path] ca=_ca-core]
    ?.  =(ship her)  ca
    ca(cor (emit %give %kick ~[path] `ship))
  ::
  ++  ca-recheck
    %+  roll  ~(tap in ca-subscriptions)
    |=  [[=ship =path] ca=_ca-core]
    ?:  (ca-can-read:ca ship)  ca
    ca(cor (emit %give %kick ~[path] `ship))
  ::
  ++  ca-take-update
    |=  =sign:agent:gall
    ^+  ca-core
    ?+    -.sign  ca-core
      %kick  ca-sub
    ::
        %watch-ack
      =.  net.chat  [%sub src.bowl]
      ?~  p.sign  ca-core
      %-  (slog leaf/"Failed subscription" u.p.sign)
      =.  gone  &
      ca-core
    ::
        %fact
      =*  cage  cage.sign 
      ?+  p.cage  ca-core
        %chat-logs    (ca-apply-logs !<(logs:c q.cage))
        %chat-update  (ca-update !<(update:c q.cage))
      ==
    ==
  ++  ca-proxy
    |=  =update:c
    ^+  ca-core
    ?>  ca-can-write
    =/  =dock  [p.flag dap.bowl]
    =/  =cage  chat-action+!>([flag update])
    =.  cor
      (emit %pass ca-area %agent dock %poke cage)
    ca-core
  ::
  ++  ca-groups-scry
    =*  group  group.perm.chat
    /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/(scot %p p.group)/[q.group]
  ::
  ++  ca-can-write
    ?:  =(p.flag src.bowl)  &
    =/  =path
      %+  welp  ca-groups-scry
      /fleet/(scot %p src.bowl)/vessel/noun
    =+  .^(=vessel:fleet:g %gx path)
    ?:  =(~ writers.perm.chat)  &
    !=(~ (~(int in writers.perm.chat) sects.vessel))
  ::
  ++  ca-can-read
    |=  her=ship
    =/  =path
      %+  welp  ca-groups-scry
      /channel/(scot %p p.flag)/[q.flag]/can-read/(scot %p her)/loob
    .^(? %gx path)
  ::
  ++  ca-pub
    |=  =path
    ^+  ca-core
    ?>  (ca-can-read src.bowl)
    =/  =logs:c
      ?~  path  log.chat
      =/  =time  (slav %da i.path)
      (lot:log-on:c log.chat `time ~)
    =/  =cage  chat-logs+!>(logs)
    =.  cor  (give %fact ~ cage)
    ca-core
  ::
  ++  ca-sub
    ^+  ca-core
    =/  tim=(unit time)
      (bind (ram:log-on:c log.chat) head)
    =/  base=wire  (snoc ca-area %updates)
    =/  =path 
      %+  weld  base
      ?~  tim  ~
      /(scot %da u.tim)
    =/  =card
      [%pass base %agent [p.flag dap.bowl] %watch path]
    =.  cor  (emit card)
    ca-core
  ++  ca-join
    |=  f=flag:c
    ^+  ca-core
    =.  chats  (~(put by chats) f *chat:c)
    =.  ca-core  (ca-abed f)
    ca-sub
  ::
  ++  ca-apply-logs
    |=  =logs:c
    ^+  ca-core
    =/  updates=(list update:c)
      (tap:log-on:c logs)
    %+  roll  updates
    |=  [=update:c ca=_ca-core]
    (ca-update:ca update)
  ::
  ++  ca-subscriptions
    %+  roll  ~(val by sup.bowl)
    |=  [[=ship =path] out=(set [ship path])]
    ?.  =((scag 4 path) (snoc ca-area %updates))
      out
    (~(put in out) [ship path])
  ::
  ++  ca-give-updates
    |=  [=time d=diff:c]
    ^+  ca-core
    =/  paths=(set path)
      %-  ~(gas in *(set path))
      (turn ~(tap in ca-subscriptions) tail)
    =.  paths  (~(put in paths) (snoc ca-area %ui))
    =/  cag=cage  chat-update+!>([time d])
    =.  cor
      (give %fact ~(tap in paths) cag)
    =?  cor  ?=(%writs -.d)
      =/  =cage  writ-diff+!>(p.d)
      (give %fact ~[(welp ca-area /ui/writs)] writ-diff+!>(p.d))
    ca-core
  ::
  ++  ca-remark-diff
    |=  diff=remark-diff:c
    ^+  ca-core
    =.  cor
      (give %fact ~[(snoc ca-area %ui)] chat-remark-action+!>([flag diff]))
    =.  remark.chat
      ?-  -.diff
        %watch    remark.chat(watching &)
        %unwatch  remark.chat(watching |)
        %read-at  !! ::  ca-core(last-read.remark.chat p.diff)
      ::
          %read   remark.chat(last-read now.bowl)
  ::    =/  [=time =writ:c]  (need (ram:on:writs:c writs.chat))
  ::    =.  last-read.remark.chat  time
  ::    ca-core
      ==
    =.  cor
      (give-brief flag/flag ca-brief)
    ca-core
  ::
  ++  ca-update
    |=  [=time d=diff:c]
    ?>  ca-can-write
    ^+  ca-core
    =.  log.chat
      (put:log-on:c log.chat time d)
    =.  ca-core
      (ca-give-updates time d)
    ?-    -.d
        %writs
      ca-core(pact.chat (reduce:ca-pact time p.d))
    ::
        %add-sects
      =*  p  perm.chat
      =.  writers.p  (~(uni in writers.p) p.d)
      ca-core
    ::
        %del-sects
      =*  p  perm.chat
      =.  writers.p  (~(dif in writers.p) p.d)
      ca-core
    ::
        %create
      =.  perm.chat  p.d
      ca-core
    ==
  --
::
++  pending-dms
  (dms-by-net %invited ~)
::
++  accepted-dms
  (dms-by-net %inviting %done ~)
::
++  archived-dms
  (dms-by-net %archive ~)
::
++  dms-by-net
  |=  nets=(list net:dm:c)
  =/  nets  (~(gas in *(set net:dm:c)) nets)
  %-  ~(gas by *(map ship dm:c))
  %+  skim  ~(tap by dms)
  |=  [=ship =dm:c]
  (~(has in nets) net.dm)
::
++  give-invites
  |=  =ship
  =/  invites
  ?:  (~(has by dms) ship)   ~(key by pending-dms)
  (~(put in ~(key by pending-dms)) ship)
  (give %fact ~[/dm/invited] ships+!>(invites))
::
++  di-core
  |_  [=ship =dm:c gone=_|]
  +*  di-pact  ~(. pac pact.dm)
      di-hark  ~(. hark-dm:ch [now.bowl ship])
  ++  di-core  .
  ++  di-abet 
    =.  dms  
      ?:  gone  (~(del by dms) ship)
      (~(put by dms) ship dm)
    cor
  ++  di-abed
    |=  s=@p
    di-core(ship s, dm (~(got by dms) s))
  ::
  ++  di-abed-soft
    |=  s=@p
    =/  new=?  (~(has by dms) s)
    =/  d
      %+  ~(gut by dms)  s
      =|  =remark:c
      =.  watching.remark  &
      [*pact:c remark ?:(=(src our):bowl %inviting %invited) |]
    =?  di-core  &(new !=(src our):bowl)
      di-invited
    di-core(ship s, dm d)

  ++  di-area  `path`/dm/(scot %p ship)
  ++  di-proxy
    |=  =diff:dm:c
    =.  di-core  (di-ingest-diff diff)
    =.  cor  (emit (proxy:di-pass diff))
    di-core
  ::
  ++  di-invited
    ^+  di-core
    =.  cor
      (emit (hark:di-pass invited:di-hark))
    di-core
  ::
  ++  di-pin
    |=  pin=?
    ^+  di-core
    di-core(pin.dm pin)
  ::
  ++  di-notify
    |=  [=id:c =delta:writs:c]
    ^+  di-core
    ?.  watching.remark.dm  di-core
    ?:  =(our.bowl p.id)  di-core
    ?:  =(%invited net.dm)  di-core
    ?+  -.delta  di-core
        %add
      ?.  ?=(%story -.content.p.delta)  di-core
      =.  cor  
        (emit (hark:di-pass (story:di-hark id p.content.p.delta)))
      di-core
    ==
  ++  di-archive
    =.  net.dm  %archive
    (di-post-notice '' ' archived the channel')
  ::
  ++  di-ingest-diff
    |=  =diff:dm:c
    =/  =path  (snoc di-area %ui)
    =.  cor  (emit %give %fact ~[path] writ-diff+!>(diff))
    =/  old-brief  di-brief
    =.  pact.dm  (reduce:di-pact now.bowl diff)
    =?  cor  &(!=(old-brief di-brief) !=(net.dm %invited))
      (give-brief ship/ship di-brief)
    =?  cor  &(=(net.dm %invited) !=(ship our.bowl))
      (give-invites ship)
    =.  di-core  
      (di-notify diff)
    di-core
  ::
  ++  di-take-counter
    |=  =diff:dm:c
    ?<  =(%archive net.dm)
    (di-ingest-diff diff)
  ::
  ++  di-post-notice
    |=  n=notice:c
    (di-ingest-diff [our now]:bowl %add ~ src.bowl now.bowl %notice n)
  ::
  ++  di-rsvp
    |=  ok=?
    =?  cor  =(our src):bowl
      (emit (proxy-rsvp:di-pass ok))
    ?>  |(=(src.bowl ship) =(our src):bowl)
    ::  TODO hook into archive
    ?.  ok  
      ~&  gone/ship
      ?:  =(src.bowl ship)
        di-core
      di-core(gone &)
    =.  net.dm  %done
    (di-post-notice '' ' joined the chat')
  ::
  ++  di-watch
    |=  =path
    ^+  di-core
    ?>  =(src.bowl our.bowl)
    ?+  path  !!
      [%ui ~]  di-core
      [%ui %writs ~]  di-core
    ==
  ::
  ++  di-agent
    |=  [=wire =sign:agent:gall]
    ^+  di-core
    ?+    wire  ~|(bad-dm-take/wire !!)
        [%proxy ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  di-core
      ::  TODO: handle?
      %-  (slog leaf/"Failed to notify about dm {<ship>}" u.p.sign)
      di-core
    ::
        [%proxy ~]
      ?>  ?=(%poke-ack -.sign)
      ?~  p.sign  di-core
      ::  TODO: handle?
      %-  (slog leaf/"Failed to dm {<ship>}" u.p.sign)
      di-core
    ==
  ::
  ++  di-peek
    |=  =path
    ^-  (unit (unit cage))
    ?+  path  [~ ~]
      [%writs *]  (peek:di-pact t.path)
    ==
  ::
  ++  di-brief  (brief:di-pact our.bowl last-read.remark.dm)
  ++  di-remark-diff
    |=  diff=remark-diff:c
    ^+  di-core
    =.  remark.dm
      ?-  -.diff
        %watch    remark.dm(watching &)
        %unwatch  remark.dm(watching |)
        %read-at  !! ::  ca-core(last-read.remark.chat p.diff)
      ::
          %read   remark.dm(last-read now.bowl)
  ::    =/  [=time =writ:c]  (need (ram:on:writs:c writs.chat))
  ::    =.  last-read.remark.chat  time
  ::    ca-core
      ==
    =.  cor  (give-brief ship/ship di-brief)
    di-core
  ++  di-pass
    |%
    ++  hark
      |=  =cage
      (pass /hark [our.bowl %hark-store] %poke cage)
    ++  pass
      |=  [=wire =dock =task:agent:gall]
      ^-  card
      [%pass (welp di-area wire) %agent dock task]
    ++  poke-them  |=([=wire =cage] (pass wire [ship dap.bowl] %poke cage))
    ++  proxy-rsvp  |=(ok=? (poke-them /proxy dm-rsvp+!>([our.bowl ok])))
    ++  proxy  |=(=diff:dm:c (poke-them /proxy dm-diff+!>(diff)))
    --
  --
--
