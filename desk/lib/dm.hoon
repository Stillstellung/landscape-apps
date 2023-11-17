/-  c=chat, d=channels
/+  mp=mop-extensions
|_  pac=pact:c
++  mope  ((mp time writ:c) lte)
++  gas
  |=  ls=(list [=time =writ:c])
  ^+  pac
  %_    pac
      wit  (gas:on:writs:c wit.pac ls)
  ::
      dex
    %-  ~(gas by dex.pac)
    %+  turn  ls
    |=  [=time =writ:c]
    ^-  [id:c _time]
    [id.writ time]
  ==
::
++  unread
  |=  [our=ship last-read=time unread-threads=(set id:c)]
  ^-  unread:unreads:c
  =/  =time
    ?~  tim=(ram:on:writs:c wit.pac)  *time
    key.u.tim
  =/  unreads
    (lot:on:writs:c wit.pac `last-read ~)
  =/  unread-id=(unit message-key:c)
    ::TODO  in the ~ case, we could traverse further up, to better handle
    ::      cases where the most recent message was deleted.
    (bind (pry:on:writs:c unreads) |=([key=@da val=writ:c] [id time]:val))
  =/  count
    (lent (skim ~(tap by unreads) |=([tim=^time =writ:c] !=(author.writ our))))
  ::  now do the same for all unread threads
  ::
  =/  [sum=@ud threads=(map message-key:c message-key:c)]
    %+  roll  ~(tap in unread-threads)
    |=  [=id:c sum=@ud threads=(map message-key:c message-key:c)]
    =/  parent   (get id)
    ?~  parent   [sum threads]
    =/  unreads  (lot:on:replies:c replies.writ.u.parent `last-read ~)
    :-  %+  add  sum
        %-  lent
        %+  skim  ~(tap by unreads)
        |=([* =reply:c] !=(author.reply our))
    =/  reply-id=(unit message-key:c)
      (bind (pry:on:replies:c unreads) |=([* reply:c] [id time]))
    ?~  reply-id  threads
    (~(put by threads) [id time]:writ.u.parent u.reply-id)
  [time (add count sum) unread-id threads]
::
++  get
  |=  =id:c
  ^-  (unit [=time =writ:c])
  ?~  tim=(~(get by dex.pac) id)
    ~
  ?~  wit=(get:on:writs:c wit.pac u.tim)
    ~
  `[u.tim u.wit]
::
++  jab
  |=  [=id:c fun=$-(writ:c [pact:c writ:c])]
  ^+  pac
  ?~  v=(get id)  pac
  =/  [=pact:c =writ:c]  (fun writ.u.v)
  =.  wit.pact  (put:on:writs:c wit.pact time.u.v writ)
  pact
::
++  got
  |=  =id:c
  ^-  [=time =writ:c]
  (need (get id))
::
++  reduce
  |=  [now=time =id:c del=delta:writs:c]
  ^+  pac
  ?-  -.del
      %add
    ?:  (~(has by dex.pac) id)
      pac
    |-
    =/  =seal:c  [id now ~ ~ [0 ~ ~]]
    ?:  (has:on:writs:c wit.pac now)
      $(now `@da`(add now ^~((div ~s1 (bex 16)))))
    =.  wit.pac
      (put:on:writs:c wit.pac now seal [memo.del %chat kind.del])
    pac(dex (~(put by dex.pac) id now))
  ::
      %del
    =/  tim=(unit time)  (~(get by dex.pac) id)
    ?~  tim  pac
    =/  =time  (need tim)
    =^  wit=(unit writ:c)  wit.pac
      (del:on:writs:c wit.pac time)
    pac(dex (~(del by dex.pac) id))
  ::
      %reply
    %+  jab  id
    |=  =writ:c
    =/  [=pact:c =replies:c]  (reduce-reply replies.writ now id [id delta]:del)
    :-  pact
    %=  writ
      replies       replies
      reply-count.meta  (wyt:on:replies:c replies)
      last-reply.meta   (biff (ram:on:replies:c replies) |=([=time *] `time))
    ::
        last-repliers.meta
      ^-  (set ship)
      =|  repliers=(set ship)
      =/  entries=(list [time reply:c])  (bap:on:replies:c replies)
      |-
      ?:  |(=(~ entries) =(3 ~(wyt in repliers)))
        repliers
      =/  [* =reply:c]  -.entries
      ?:  (~(has in repliers) author.reply)
        $(entries +.entries)
      (~(put in repliers) author.reply)
    ==
  ::
      %add-react
    %+  jab  id
    |=  =writ:c
    :-  pac
    writ(reacts (~(put by reacts.writ) [ship react]:del))
  ::
      %del-react
    %+  jab  id
    |=  =writ:c
    :-  pac
    writ(reacts (~(del by reacts.writ) ship.del))
  ==
::
++  reduce-reply
  |=  [=replies:c now=time parent-id=id:c =id:c delta=delta:replies:c]
  ^-  [pact:c replies:c]
  |^
  ?-  -.delta
      %add
    |-
    ?:  (has:on:replies:c replies now)
      $(now `@da`(add now ^~((div ~s1 (bex 16)))))
    =/  reply-seal  [id parent-id now ~]
    ?:  (~(has by dex.pac) id)  [pac replies]
    =.  dex.pac  (~(put by dex.pac) id now)
    [pac (put:on:replies:c replies now reply-seal memo.delta)]
  ::
      %del
    =/  tim=(unit time)  (~(get by dex.pac) id)
    ?~  tim  [pac replies]
    =/  =time  (need tim)
    =^  reply=(unit reply:c)  replies
      (del:on:replies:c replies time)
    =.  dex.pac  (~(del by dex.pac) id)
    [pac replies]
  ::
      %add-react
    :-  pac
    %+  jab-reply  id
    |=  =reply:c
    reply(reacts (~(put by reacts.reply) [ship react]:delta))
  ::
      %del-react
    :-  pac
    %+  jab-reply  id
    |=  =reply:c
    reply(reacts (~(del by reacts.reply) ship.delta))
  ==
  ++  get-reply
    |=  =id:c
    ^-  (unit [=time =reply:c])
    ?~  tim=(~(get by dex.pac) id)        ~
    ?~  qup=(get:on:replies:c replies u.tim)  ~
    `[u.tim u.qup]
  ++  jab-reply
    |=  [=id:c fun=$-(reply:c reply:c)]
    ^+  replies
    ?~  v=(get-reply id)  replies
    (put:on:replies:c replies time.u.v (fun reply.u.v))
  --
::
++  give-paged-writs
  |=  [mode=?(%light %heavy) ls=(list [time writ:c])]
  ^-  (unit (unit cage))
  =;  p=paged-writs:c  ``chat-paged-writs+!>(p)
  =/  =writs:c
    %+  gas:on:writs:c  *writs:c
    ?:  =(%heavy mode)  ls
    %+  turn  ls
    |=  [=time =writ:c]
    [time writ(replies *replies:c)]
  =/  newer=(unit id:c)
    =/  more  (tab:on:writs:c writs `-:(rear ls) 1)
    ?~(more ~ `id.val:(head more))
  =/  older=(unit id:c)
    =/  more  (bat:mope writs `-:(head ls) 1)
    ?~(more ~ `id.val:(head more))
  :*  writs
      newer
      older
      (wyt:on:writs:c writs)
  ==
::
++  get-around
  |=  [mode=?(%light %heavy) =time count=@ud]
  ^-  (unit (unit cage))
  =/  older  (bat:mope wit.pac `time count)
  =/  newer  (tab:on:writs:c wit.pac `time count)
  =/  writ   (get:on:writs:c wit.pac time)
  =/  writs
    ?~  writ
      (welp older newer)
    (welp (snoc older [time u.writ]) newer)
  (give-paged-writs mode writs)
++  peek
  |=  [care=@tas =(pole knot)]
  ^-  (unit (unit cage))
  =*  on   on:writs:c
  ?+    pole  [~ ~]
  ::
      [%newest count=@ mode=?(%light %heavy) ~]
    =/  count  (slav %ud count.pole)
    =/  writs  (top:mope wit.pac count)
    (give-paged-writs mode.pole writs)
  ::
      [%older start=@ count=@ mode=?(%light %heavy) ~]
    =/  count  (slav %ud count.pole)
    =/  start  (slav %ud start.pole)
    =/  writs  (bat:mope wit.pac `start count)
    (give-paged-writs mode.pole writs)
  ::
      [%newer start=@ count=@ mode=?(%light %heavy) ~]
    =/  count  (slav %ud count.pole)
    =/  start  (slav %ud start.pole)
    =/  writs  (tab:on wit.pac `start count)
    (give-paged-writs mode.pole writs)
  ::
      [%around time=@ count=@ mode=?(%light %heavy) ~]
    =/  time    (slav %ud time.pole)
    =/  count   (slav %ud count.pole)
    (get-around mode.pole time count)
  ::
      [%around ship=@ time=@ count=@ mode=?(%light %heavy) ~]
    =/  ship    (slav %p ship.pole)
    =/  time    (slav %ud time.pole)
    =/  count   (slav %ud count.pole)
    =/  entry   (get ship `@da`time)
    ?~  entry  ``chat-paged-writs+!>(*paged-writs:c)
    (get-around mode.pole time.u.entry count)
  ::
      [%writ %id ship=@ time=@ ~]
    =/  ship  (slav %p ship.pole)
    =/  time  (slav %ud time.pole)
    ?.  ?=(%u care)
      ``writ+!>(writ:(got ship `@da`time))
    ``loob+!>(?~((get ship `@da`time) | &))
  ==
::
++  search
  |^  |%
      ++  mention
        |=  [sip=@ud len=@ud nedl=^ship]
        ^-  scan:c
        (scour sip len %mention nedl)
      ::
      ++  text
        |=  [sip=@ud len=@ud nedl=@t]
        ^-  scan:c
        (scour sip len %text nedl)
      --
  ::
  +$  match-type
    $%  [%mention nedl=ship]
        [%text nedl=@t]
    ==
  ::
  ++  scour
    |=  [sip=@ud len=@ud =match-type]
    ?>  (gth len 0)
    ^-  scan:c
    =+  s=[sip=sip len=len *=scan:c]
    =-  (flop scan)
    |-  ^+  s
    ?~  wit.pac  s
    ?:  =(0 len.s)  s
    =.  s  $(wit.pac r.wit.pac)
    ?:  =(0 len.s)  s
    ::
    =.  s
      ?.  (match val.n.wit.pac match-type)  s
      ?:  (gth sip.s 0)
        s(sip (dec sip.s))
      s(len (dec len.s), scan [[%writ val.n.wit.pac] scan.s])
    ::
    =.  s  (scour-replies s id.val.n.wit.pac replies.val.n.wit.pac match-type)
    ::
    $(wit.pac l.wit.pac)
  ::
  ++  scour-replies
    |=  [s=[skip=@ud len=@ud =scan:c] =id:c =replies:c =match-type]
    |-  ^+  s
    ?~  replies  s
    ?:  =(0 len.s)  s
    =.  s  $(replies r.replies)
    ?:  =(0 len.s)  s
    ::
    =.  s
      ?.  (match-reply val.n.replies match-type)  s
      ?:  (gth skip.s 0)
        s(skip (dec skip.s))
      s(len (dec len.s), scan [[%reply id val.n.replies] scan.s])
    ::
    $(replies l.replies)
  ::
  ++  match
    |=  [=writ:c =match-type]
    ^-  ?
    ?-  -.match-type
      %mention  (match-writ-mention nedl.match-type writ)
      %text     (match-writ-text nedl.match-type writ)
    ==
  ::
  ++  match-reply
    |=  [=reply:c =match-type]
    ?-  -.match-type
      %mention  (match-story-mention nedl.match-type content.reply)
      %text     (match-story-text nedl.match-type content.reply)
    ==
  ::
  ++  match-writ-mention
    |=  [nedl=ship =writ:c]
    ^-  ?
    ?:  ?=([%notice ~] kind.writ)  |
    (match-story-mention nedl content.writ)
  ::
  ++  match-story-mention
    |=  [nedl=ship =story:d]
    %+  lien  story
    |=  =verse:d
    ?.  ?=(%inline -.verse)  |
    %+  lien  p.verse
    |=  =inline:d
    ?+  -.inline  |
      %ship                                  =(nedl p.inline)
      ?(%bold %italics %strike %blockquote)  ^$(p.verse p.inline)
    ==
  ::
  ++  match-writ-text
    |=  [nedl=@t =writ:c]
    ?:  ?=([%notice ~] kind.writ)  |
    (match-story-text nedl content.writ)
  ::
  ++  match-story-text
    |=  [nedl=@t =story:d]
    %+  lien  story
    |=  =verse:d
    ?.  ?=(%inline -.verse)  |
    %+  lien  p.verse
    |=  =inline:d
    ?@  inline
      (find nedl inline |)
    ?.  ?=(?(%bold %italics %strike %blockquote) -.inline)  |
    ^$(p.verse p.inline)
  ::
  ++  find
    |=  [nedl=@t hay=@t case=?]
    ^-  ?
    =/  nlen  (met 3 nedl)
    =/  hlen  (met 3 hay)
    ?:  (lth hlen nlen)
      |
    =?  nedl  !case
      (cass nedl)
    =/  pos  0
    =/  lim  (sub hlen nlen)
    |-
    ?:  (gth pos lim)
      |
    ?:  .=  nedl
        ?:  case
          (cut 3 [pos nlen] hay)
        (cass (cut 3 [pos nlen] hay))
      &
    $(pos +(pos))
  ::
  ++  cass
    |=  text=@t
    ^-  @t
    %^    run
        3
      text
    |=  dat=@
    ^-  @
    ?.  &((gth dat 64) (lth dat 91))
      dat
    (add dat 32)
  --
--
