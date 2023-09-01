::  TODO: move outside /desk directory, don't ship this
::
::DONE  assert things about state
::DONE  test all actions that don't require cross-ship comms
::TODO  test cross-ship comms (will do manual)
::
::  - test that partial checkpoint is partial
::  - test join, leave, read, read-at
::  - test permissions
::
/-  spider, d=diary, g=groups, e=epic
/+  s=strandio
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  verb  (fall !<((unit ?) arg) |)
=/  group  %hackers
=/  chan  %hackweek
=/  app  %channels
=/  server  (cat 3 app '-server')
;<  our=ship  bind:m  get-our:s
=/  =nest:d  [%diary our chan]
|^
=/  m  (strand ,vase)
;<  ~  band:m  (poke-our:s %hood %kiln-nuke !>([%groups &]))
;<  ~  band:m  (poke-our:s %hood %kiln-revive !>(%groups))
;<  ~  band:m
  =/  m  (strand ,~)
  ?.  verb  (pure:m ~)
  ;<  ~  band:m  (poke-our:s app %verb !>(%loud))
  (poke-our:s server %verb !>(%loud))
;<  ~  band:m  (group-create group 'hacking' 'hacked' '' '' [%open ~ ~] ~ |)
;<  ~  band:m
  (act %create %diary chan [our group] 'hack week' 'hacking all week' ~ ~)
::  make a bunch of posts
::
=|  count=@ud
|-
;<  =id-note:d  band:m  (add-note count)
?:  (lth count 30)
  $(count +(count))
::  leave a single comment on the last post
::
;<  now=@da  band:m  get-time:s
=/  =memo:d   [[~ 'hacking is bad' ~] our now]
;<  ~  band:m  (act %diary nest %note %quip id-note %add memo)
::
::  ensure that we've got all the same notes on both sides
::
;<  =notes:d  band:m  (check-note-count +(count))
;<  sst=server-state  band:m  get-server-state
?>  (eq !>(notes) !>(notes:(~(got by shelf.sst) nest)))
::
::  nuke %diary and re-join the channel.  ensure we only got a partial
::  checkpoint
::
;<  ~  band:m  (poke-our:s %hood %kiln-nuke !>([app |]))
;<  ~  band:m  (poke-our:s %hood %kiln-revive !>(%groups))
;<  ~  band:m  (act %diary nest %join [our group])
;<  *  band:m  (check-note-count 20)
::
::  post another essay, ensure we got it
::
=.  count  +(count)
;<  *  band:m  (add-note count)
;<  *  band:m  (check-note-count 21)
::
;<  ~  band:m  test-c-diary
;<  ~  band:m  test-c-note
::
(pure:m !>(%success))
::
+$  state         [%0 =shelf:d voc=(map [nest:d plan:d] (unit said:d))]
+$  server-state  [%0 =shelf:d]
::
++  eq
  |=  [a=vase b=vase]
  ^-  ?
  ?:  =(q.a q.b)  &
  %-  (slog 'need' (sell a) 'have' (sell b) ~)
  |
::
++  neq
  |=  [a=vase b=vase]
  ^-  ?
  ?:  !=(q.a q.b)  &
  %-  (slog 'need different' (sell a) ~)
  |
::
++  strand
  |*  a=mold
  |%
  ++  def  (^strand a)
  ++  form  form:def
  ++  pure  pure:def
  ++  bind  bind:def
  ++  band
    |*  b=mold
    =/  m  (strand ,a)
    |=  [m-b=(strand-form-raw:rand b) fun=$-(b form:m)]
    ^-  form:m
    ;<  ~  bind:m  (sleep:s `@dr`0)
    ((bind:m b) m-b fun)
  --
::
++  act
  |=  =a-shelf:d
  =/  m  (strand ,~)
  ^-  form:m
  (poke-our:s app %channel-action !>(a-shelf))
::
++  group-create
  |=  =create:g
  =/  m  (strand ,~)
  ^-  form:m
  (poke-our:s %groups %group-create !>(create))
::
++  dbug
  |=  =dude:gall
  =/  m  (strand ,~)
  ^-  form:m
  (poke-our:s dude %dbug !>([%state '']))
::
++  get-diary
  =/  m  (strand ,diary:d)
  ^-  form:m
  ;<  st=state  band:m  get-state
  (pure:m (~(got by shelf.st) nest))
::
++  get-state
  =/  m  (strand ,state)
  ^-  form:m
  ;<  =bowl:spider  band:m  get-bowl:s
  %-  pure:m
  =<  -
  !<  [state epic:e]
  .^  vase
      /gx/(scot %p our.bowl)/[app]/(scot %da now.bowl)/dbug/state/noun
  ==
::
++  get-server-state
  =/  m  (strand ,server-state)
  ^-  form:m
  ;<  =bowl:spider  band:m  get-bowl:s
  %-  pure:m
  =<  -
  !<  [server-state epic:e]
  .^  vase
      /gx/(scot %p our.bowl)/[server]/(scot %da now.bowl)/dbug/state/noun
  ==
::
++  check-note-count
  |=  count=@ud
  =/  m  (strand ,notes:d)
  ^-  form:m
  ;<  =diary:d  band:m  get-diary
  ?>  (eq !>(count) !>(~(wyt by notes.diary)))
  (pure:m notes.diary)
::
++  add-note
  |=  count=@ud
  =/  m  (strand ,id-note:d)
  ^-  form:m
  ;<  send=@da  band:m  get-time:s
  =/  =essay:d  [~ our send %diary (cat 3 'on hacking #' (scot %ud count)) '']
  ;<  ~  bind:m  (act %diary nest %note %add essay)
  (pure:m send)
::
++  add-quip
  |=  [=id-note:d text=cord]
  =/  m  (strand ,id-quip:d)
  ^-  form:m
  ;<  send=@da  band:m  get-time:s
  =/  =memo:d  [[~ ~[text]] our send]
  ;<  ~  bind:m  (act %diary nest %note %quip id-note %add memo)
  (pure:m send)
::
::  test non-note diary commands
::
++  test-c-diary
  =/  m  (strand ,~)
  ^-  form:m
  ;<  ~  band:m  (act %diary nest %add-writers %del-role ~ ~)
  ::
  ;<  now=@da  band:m  get-time:s
  ;<  old=diary:d  band:m  get-diary
  ?>  (neq !>(%grid) !>(view.view.old))
  ?>  (neq !>(%alpha) !>(sort.sort.old))
  ?>  (neq !>(&) !>((~(has in writers.perm.perm.old) %add-role)))
  ?>  (neq !>(|) !>((~(has in writers.perm.perm.old) %del-role)))
  ?>  (neq !>(`~[now]) !>(order.order.old))
  ::
  ;<  ~  band:m  (act %diary nest %view %grid)
  ;<  ~  band:m  (act %diary nest %sort %alpha)
  ;<  ~  band:m  (act %diary nest %add-writers %add-role ~ ~)
  ;<  ~  band:m  (act %diary nest %del-writers %del-role ~ ~)
  ;<  ~  band:m  (act %diary nest %order ~ now ~)
  ::
  ;<  new=diary:d  band:m  get-diary
  ?>  (eq !>(%grid) !>(view.view.new))
  ?>  (eq !>(%alpha) !>(sort.sort.new))
  ?>  (eq !>(&) !>((~(has in writers.perm.perm.new) %add-role)))
  ?>  (eq !>(|) !>((~(has in writers.perm.perm.new) %del-role)))
  ?>  (eq !>(`~[now]) !>(order.order.new))
  ::
  ?>  (eq !>(+(rev.view.old)) !>(rev.view.new))
  ?>  (eq !>(+(rev.sort.old)) !>(rev.sort.new))
  ?>  (eq !>(+(+(rev.perm.old))) !>(rev.perm.new))
  ?>  (eq !>(+(rev.order.old)) !>(rev.order.new))
  (pure:m ~)
::
::  test note diary commands
::
++  test-c-note
  =/  m  (strand ,~)
  ^-  form:m
  ;<  old=diary:d  band:m  get-diary
  =/  count=@ud  ~(wyt by notes.old)
  ;<  id=id-note:d  band:m  (add-note 1.000)
  ;<  new=diary:d  band:m  get-diary
  ?>  (eq !>(+(count)) !>(~(wyt by notes.new)))
  ?>  (eq !>(&) !>((has:on-notes:d notes.new id)))
  ::
  ;<  ~  band:m  (act %diary nest %note %edit id [~ our id %diary 'yes' ''])
  ;<  new=note:d  band:m  (get-note id)
  ?>  (eq !>([%diary 'yes' '']) !>(han-data.new))
  ::
  ?>  (eq !>(~) !>(feels.new))
  ;<  ~  band:m  (act %diary nest %note %add-feel id our ':smile:')
  ;<  new=note:d  band:m  (get-note id)
  =/  feel  (~(got by feels.new) our)
  ?>  (eq !>([0 `':smile:']) !>(feel))
  ::
  ;<  ~  band:m  (act %diary nest %note %del-feel id our)
  ;<  new=note:d  band:m  (get-note id)
  =/  feel  (~(got by feels.new) our)
  ?>  (eq !>([1 ~]) !>(feel))
  ::
  ;<  ~  band:m  (act %diary nest %note %del id)
  ;<  new=diary:d  band:m  get-diary
  ?>  (eq !>(~) !>((got:on-notes:d notes.new id)))
  ::
  (pure:m ~)
::
++  get-note
  |=  =id-note:d
  =/  m  (strand ,note:d)
  ^-  form:m
  ;<  =diary:d  band:m  get-diary
  (pure:m (need (got:on-notes:d notes.diary id-note)))
::  test diary quip commands
::
++  test-c-quip
  =/  m  (strand ,~)
  ^-  form:m
  ;<  =id-note:d  band:m  (add-note 1.001)
  ::
  ;<  id=id-quip:d  band:m  (add-quip id-note 'hi')
  ;<  =quip:d  band:m  (get-quip id-note id)
  ?>  (eq !>([~ ~['hi']]) !>(content.quip))
  ::
  ;<  ~  band:m  (act %diary nest %note %quip id-note %add-feel id our ':smile:')
  ;<  new=quip:d  band:m  (get-quip id-note id)
  =/  feel  (~(got by feels.quip) our)
  ?>  (eq !>([0 `':smile:']) !>(feel))
  ::
  ;<  ~  band:m  (act %diary nest %note %quip id-note %del-feel id our)
  ;<  new=quip:d  band:m  (get-quip id-note id)
  =/  feel  (~(got by feels.quip) our)
  ?>  (eq !>([1 ~]) !>(feel))
  ::
  ;<  ~  band:m  (act %diary nest %note %quip id-note %del id)
  ;<  =note:d  band:m  (get-note id-note)
  ?>  (eq !>(~) !>((got:on-quips:d quips.note id)))
  ::
  (pure:m ~)
::
++  get-quip
  |=  [=id-note:d =id-quip:d]
  =/  m  (strand ,quip:d)
  ^-  form:m
  ;<  =note:d  band:m  (get-note id-note)
  (pure:m (need (got:on-quips:d quips.note id-quip)))
--
