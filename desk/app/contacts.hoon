/-  *contacts, e=epic
/+  default-agent, dbug, verb
::
|%
++  okay  `epic:e`0
++  mar
  |%
  ++  base
    |%
    +$  act  %contact-action
    +$  upd  %contact-update
    --
  ++  act  `mark`^~((rap 3 *act:base '-' (scot %ud okay) ~))
  ++  upd  `mark`^~((rap 3 *upd:base '-' (scot %ud okay) ~))
  --
::
+$  card     card:agent:gall
+$  state-0  [%0 rof=profile rol=rolodex]
--
::
%-  agent:dbug
%+  verb  &
^-  agent:gall
=|  state-0
=*  state  -
::
=<  |_  =bowl:gall
    +*  this  .
        def   ~(. (default-agent this %|) bowl)
        cor   ~(. raw bowl)
    ::
    ++  on-init
      ^-  (quip card _this)
      =^  cards  state  abet:init:cor
      [cards this]
    ::
    ++  on-save  !>([state okay])
    ::
    ++  on-load
      :: =-  _`this
      |=  old=vase
      ^-  (quip card _this)
      =^  cards  state  abet:(load:cor old)
      [cards this]
    ::
    ++  on-watch
      |=  =path
      ^-  (quip card _this)
      =^  cards  state  abet:(peer:cor path)
      [cards this]
    ::
    ++  on-poke
      |=  [=mark =vase]
      ^-  (quip card _this)
      =^  cards  state  abet:(poke:cor mark vase)
      [cards this]
    ::
    ++  on-peek   peek:cor
    ++  on-leave  on-leave:def
    ::
    ++  on-agent
      |=  [=wire =sign:agent:gall]
      ^-  (quip card _this)
      =^  cards  state  abet:(agent:cor wire sign)
      [cards this]
    ::
    ++  on-arvo   on-arvo:def
    ++  on-fail   on-fail:def
    --
::
|%
::
+|  %help
::
++  do-edit
  |=  [c=contact f=field]
  ^+  c
  ?-  -.f
    %nickname   c(nickname nickname.f)
    %bio        c(bio bio.f)
    %status     c(status status.f)
    %color      c(color color.f)
  ::
    %avatar     ~|  "cannot add a data url to avatar!"
                ?>  ?|  ?=(~ avatar.f)
                        !=('data:' (end 3^5 u.avatar.f))
                    ==
                c(avatar avatar.f)
  ::
    %cover      ~|  "cannot add a data url to cover!"
                ?>  ?|  ?=(~ cover.f)
                        !=('data:' (end 3^5 u.cover.f))
                    ==
                c(cover cover.f)
  ::
    %add-group  c(groups (~(put in groups.c) resource.f))
  ::
    %del-group  c(groups (~(del in groups.c) resource.f))
  ==
::
++  do-edits
  |=  [c=contact l=(list field)]
  ^-  (unit contact)
  =-  ?:(=(- c) ~ `-)
  (roll l |=([f=field c=_c] (do-edit c f)))
::
++  mono
  |=  [old=@da new=@da]
  ^-  @da
  ?:  (lth old new)  new
  (add old ^~((div ~s1 (bex 16))))
::
+|  %state
::
::    namespaced to avoid accidental direct reference
::
++  raw
  =|  out=(list card)
  |_  =bowl:gall
  ::
  +|  %generic
  ::
  ++  abet  [(flop out) state]
  ++  cor   .
  ++  emit  |=(c=card cor(out [c out]))
  ++  give  |=(=gift:agent:gall (emit %give gift))
  ++  pass  |=([=wire =note:agent:gall] (emit %pass wire note))
  ::
  +|  %operations
  ::
  ++  pub
    =>  |%
        ::  if this proves to be too slow, the set of paths
        ::  should be maintained statefully: put on +init:pub,
        ::  and filtered on +load (to avoid a space leak).
        ::
        ++  subs
          ^-  (set path)
          %-  ~(rep by sup.bowl)
          |=  [[duct ship pat=path] acc=(set path)]
          ?.(?=([%contact *] pat) acc (~(put in acc) pat))
        ::
        ++  fact
          |=  [pat=(list path) u=update]
          ^-  gift:agent:gall
          [%fact pat %contact-update-0 !>(u)]
        --
    ::
    |%
    ++  news
      |=(n=^news (give %fact [/news ~] %contact-news !>(n)))
    ::
    ++  diff
      |=  con=?(~ contact)
      =/  u=update  [?~(rof now.bowl (mono wen.rof now.bowl)) con]
      (give:(news(rof u) our.bowl con) (fact ~(tap in subs) u))
    ::
    ++  init
      |=  wen=(unit @da)
      ?~  rof  cor
      ?~  wen  (give (fact ~ rof))
      ?:  =(u.wen wen.rof)  cor
      ?>((lth u.wen wen.rof) (give (fact ~ rof))) :: no future subs
    --
  ::
  ++  sub
    |=  who=ship
    ?<  =(our.bowl who)
    =/  for=(pair profile ?(~ saga:e))
      (~(gut by rol) who [~ ~])
    |%
    ++  hear
      |=  u=update
      ^+  cor
      ?:  &(?=(^ p.for) (lte wen.u wen.p.for))
        cor
      (news:pub(rol (~(put by rol) who for(p u))) who con.u)
    ::
    ++  have  (~(has by wex.bowl) [/contact who dap.bowl]) :: XX check state
    ::
    ++  meet  cor(rol (~(put by rol) who for))
    ::
    ++  heed
      ^+  cor
      ?:  have  cor
      =/  pat  ?~(p.for / /at/(scot %da wen.p.for))
      (pass /contact %agent [who dap.bowl] %watch [%contact pat]) ::  XX track subscription state
    ::
    ++  drop
      =.  cor  snub
      cor(rol (~(del by rol) who)) :: XX delete, or just ~ the profile?
    ::
    ++  snub   :: XX track subscription state
      ?.  have  cor
      (pass /contact %agent [who dap.bowl] %leave ~)
    ::
    ++  odd
      |=  =mark
      =*  upd  *upd:base:mar
      =*  wid  ^~((met 3 upd))
      ?.  =(upd (end [3 wid] mark))
        ~|(fake-news+mark !!)
      ~|  bad-update-mark+mark
      =/  cool  (slav %ud (rsh 3^+(wid) mark))
      ?>  (gth cool okay)
      ::  XX set sub state to %dex
      ::
      peer:epic(cor snub)
    ::
    ++  epic
      |%
      ++  take
        |=  =epic:e
        ::  XX unsub from /epic
        ::  XX switch on sub state, do the needful
        ::  - %dex -> %dex
        ::  - %lev -> %chi | %lev
        ::  - %chi -> %dex
        !!
      ::
      ++  peer
        (pass /epic %agent [who dap.bowl] %watch /epic)
      --
    --
  ::
  ++  migrate
    =>  |%
        ++  legacy
          |%
          +$  rolodex  (map ship contact)
          +$  contact
            $:  nickname=@t
                bio=@t
                status=@t
                color=@ux
                avatar=(unit @t)
                cover=(unit @t)
                groups=(set resource)
                last-updated=@da
            ==
          --
        --
    ::
    ^+  cor
    ?.  .^(? gu+/=contact-store=)
      cor
    =/  ful  .^(rolodex:legacy gx+/=contact-store=/all/noun)
    ::
    |^  cor(rof us, rol them)
    ++  us
      ^-  profile
      ?~  old=(~(get by ful) our.bowl)  ~
      (convert u.old)
    ::
    ++  them
      ^-  rolodex
      %-  ~(rep by ful)
      |=  [[who=ship con=contact:legacy] rol=rolodex]
      (~(put by rol) who (convert con) ~)  :: XX subscribe to any?
    ::
    ++  convert
      |=  con=contact:legacy
      ^-  profile
      ?:  =(*contact:legacy con)  ~
      [last-updated.con con(|6 groups.con)]
    --
  ::
  +|  %implementation
  ::
  ++  init  migrate
  ::
  ++  load
    |=  old-vase=vase
    ^+  cor
    |^  =+  !<([old=versioned-state cool=epic:e] old-vase)
        =.  state
          ?-  -.old
            %0  old
          ==
        ?>  (gte okay cool)  :: no time loops!
        ?:  =(okay cool)  cor
        ::  XX scrape thru subscription state and resub
        ::
        (give %fact [/epic ~] epic+!>(okay))
    ::
    +$  versioned-state
      $%  state-0
      ==
    --
  ::
  ++  poke
    |=  [=mark =vase]
    ^+  cor
    ?+    mark  ~|(bad-mark+mark !!)
        ::  incompatible changes get a mark version bump
        ::
        ::    the agent should maintain compatibility by either
        ::    directly handling or upconverting old-marked pokes
        ::
        ?(act:base:mar %contact-action-0)
      ?>  =(our src):bowl
      =/  act  !<(action vase)
      ?-  -.act
        %anon  ?.  ?=([@ ^] rof)
                 cor
               (diff:pub ~)
      ::
        %edit   ?~  new=(do-edits ?.(?=([@ ^] rof) *contact con.rof) p.act)
                 cor
               (diff:pub u.new)
      ::
        %meet  (roll p.act |=([who=@p acc=_cor] meet:(sub:acc who)))
        %heed  (roll p.act |=([who=@p acc=_cor] heed:(sub:acc who)))
        %drop  (roll p.act |=([who=@p acc=_cor] drop:(sub:acc who)))
        %snub  (roll p.act |=([who=@p acc=_cor] snub:(sub:acc who)))
      ==
    ==
  ::
  ++  peek
    |=  pat=(pole knot)
    ^-  (unit (unit cage))
    ?+    pat  [~ ~]
        [%x %all ~]
      =/  lor=rolodex
        ?:  |(?=(~ rof) ?=(~ con.rof))  rol
        (~(put by rol) our.bowl rof ~)
      ``contact-rolodex+!>(lor)
    ::
        [%x %contact her=@ ~]
      ?~  who=`(unit @p)`(slaw %p her.pat)
        [~ ~]
      =/  tac=?(~ contact)
        ?:  =(our.bowl u.who)  ?~(rof ~ con.rof)
        =/  for  (~(get by rol) u.who)
        ?:  |(?=(~ for) ?=(~ p.u.for))  ~
        con.p.u.for
      ?~  tac  [~ ~]
      ``contact+!>(`contact`tac)
    ==
  ::
  ++  peer
    |=  pat=(pole knot)
    ^+  cor
    ?+  pat  ~|(bad-watch-path+pat !!)
      [%contacts %at wen=@ ~]  (init:pub `(slav %da wen.pat))
      [%contacts ~]  (init:pub ~)
      [%epic ~]  (give %fact ~ epic+!>(okay))
      [%news ~]  ~|(local-news+src.bowl ?>(=(our src):bowl cor))
    ==
  ::
  ++  agent
    |=  [=wire =sign:agent:gall]
    ^+  cor
    ?+  wire  ~|(evil-agent+wire !!)
        [%contact ~]
      ?-  -.sign
        %poke-ack   ~|(strange-poke-ack+wire !!)
        %watch-ack  cor :: XX handle with epic sub?
        %kick       heed:(sub src.bowl)
        %fact       ?+    p.cage.sign  (odd:(sub src.bowl) p.cage.sign)
                        ::  incompatible changes get a mark version bump
                        ::
                        ::    XX details
                        ::
                        ?(upd:base:mar %contact-update-0)
                      (hear:(sub src.bowl) !<(update q.cage.sign))
      ==            ==
    ::
        [%epic ~]
      ?-  -.sign
        %poke-ack   ~|(strange-poke-ack+wire !!)
        %watch-ack  cor :: XX handle nack w/ failure state?
        %kick       peer:epic:(sub src.bowl)
        %fact       ?+  p.cage.sign  ~|(not-epic+p.cage.sign !!) :: XX drop? set sub state?
                      %epic  (take:epic:(sub src.bowl) !<(epic:e q.cage.sign))
      ==            ==
    ==
  --
--
