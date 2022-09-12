/-  g=groups, c=cite
|%
+$  flag  (pair ship term)
+$  feel  @ta
+$  view  ?(%grid %list)
+$  sort  ?(%alpha %time)
+$  shelf  (map flag:g diary)
+$  diary
  $:  =net
      =log
      =perm
      =view
      =sort
      =notes
      =remark
      banter=(map time quips)
  ==
++  notes
  =<  notes
  |%
  +$  notes
    ((mop time note) lte)
  ++  on
    ((^on time note) lte)
  +$  diff
    (pair time delta)
  +$  delta
    $%  [%add p=essay]
        [%edit p=essay]
        [%del ~]
        [%add-feel p=ship q=feel]
        [%del-feel p=ship]
    ==
  --
++  quips
  =<  quips
  |%
  +$  quips
    ((mop time quip) lte)
  ++  on
    ((^on time quip) lte)
  +$  diff
    (pair time delta)
  +$  delta
    $%  [%add p=memo]
        [%del ~]
        [%add-feel p=ship q=feel]
        [%del-feel p=ship]
    ==
  --
+$  note  [seal essay]
+$  quip  [seal memo]
::
+$  seal
  $:  =time
      feels=(map ship feel)
  ==
+$  essay
  $:  title=@t
      image=@t
      content=(list verse)
      author=ship
      sent=time      
  ==
+$  memo
  $:  replying=time
      content=(list inline)
      author=ship
      sent=time
  ==
+$  verse  
  $%  [%block p=block]
      [%inline p=(list inline)]
  ==
+$  block
  $%  [%image src=cord height=@ud width=@ud alt=cord]
      [%cite =cite:c]
  ==
+$  inline
  $@  @t
  $%  [%italics p=(list inline)]
      [%bold p=(list inline)]
      [%strike p=(list inline)]
      [%blockquote p=(list inline)]
      [%inline-code p=cord]
      [%block p=@ud q=cord]
      [%code p=cord]
      [%tag p=cord]
      [%link p=cord q=cord]
      [%break ~]
  ==
::
+$  log
  ((mop time diff) lte)
++  log-on
  ((on time diff) lte)
+$  action
  (pair flag:g update)
+$  update
  (pair time diff)
+$  diff
  $%  [%notes p=diff:notes]
      [%quips p=time q=diff:quips]
    ::
      [%add-sects p=(set sect:g)]
      [%del-sects p=(set sect:g)]
    ::
      [%create p=perm]
      [%view p=view]
      [%sort p=sort]
    ::
  ==
+$  net
  $~  [%load ~]
  $%  [%sub p=ship]
      [%pub ~] :: TODO: permissions?
      [%load ~]
  ==
++  briefs
  =<  briefs
  |% 
  +$  briefs
    (map flag brief)
  +$  brief
    [last=time count=@ud read-id=(unit time)]
  +$  update
    (pair flag brief)
  --
::
+$  remark
  [last-read=time watching=_| ~]
::
+$  remark-action
  (pair flag remark-diff)
::
+$  remark-diff
  $%  [%read ~]
      [%read-at p=time]
      [?(%watch %unwatch) ~]
  ==
::
+$  perm
  $:  writers=(set sect:g)
      group=flag:g
  ==
::
+$  leave  flag:g
::
+$  create
  $:  group=flag:g  :: TODO: unmanaged-style group chats
      name=term
      title=cord
      description=cord
      readers=(set sect:g)
      writers=(set sect:g)
  ==
::
--
