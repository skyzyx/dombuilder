(->
  X = (elem, attr) ->
    notation = (elem) ->
      attr = class: []
      dotHashRe = new RegExp("[.#]")
      return {}  unless dotHashRe.test(elem)
      pieces = elem.split(dotHashRe)
      elemType = pieces.shift()
      pos = elemType.length
      classes = attr["class"]
      for piece of pieces
        if pieces.hasOwnProperty(piece)
          if elem[pos] == "#"
            attr.id = pieces[piece]
          else
            classes.push pieces[piece]
          pos += pieces[piece].length + 1
      attr["class"] = classes
      delete attr["class"]  unless attr["class"].length
      attr
    merge_options = (o1, o2) ->
      o3 = {}
      for attrname of o1
        o3[attrname] = o1[attrname]  if o1.hasOwnProperty(attrname)
      for attrname of o2
        o3[attrname] = o2[attrname]  if o2.hasOwnProperty(attrname)
      o3
    _ = this
    d = document
    dotHashRe = new RegExp("[.#]")
    attr = merge_options(attr, notation(elem))
    if dotHashRe.test(elem)
      _.e = d.createElement(elem.split(dotHashRe).shift())
    else
      _.e = d.createElement(elem)
    if attr
      for key of attr
        if attr.hasOwnProperty(key)
          attr[key] = attr[key].join(" ")  if typeof attr[key] == "object" and typeof attr[key].length == "number" and typeof attr[key].splice == "function"
          if key.toString() == "class"
            _.e.className = attr[key]
          else
            _.e.setAttribute key, attr[key]
    _.child = _._ = (obj) ->
      obj = [ obj ]  if typeof obj != "object" or typeof obj.length != "number" or typeof obj.splice != "function"
      i = 0
      max = obj.length
      
      while i < max
        break  if typeof obj[i] == "undefined"
        if typeof obj[i].asDOM != "undefined"
          _.e.appendChild obj[i].asDOM()
        else
          _.e.appendChild obj[i]
        i++
      _
    
    _.html = _.H = (str, replace) ->
      return _.asHTML()  if arguments.length == 0
      replace = replace or false
      if replace
        _.e.innerHTML = str
      else
        _.e.innerHTML += str
      _
    
    _.text = _.T = (str) ->
      return _.asText()  if arguments.length == 0
      if _.e.innerText
        _.e.innerText = str
      else
        text = document.createTextNode(str)
        _.e.appendChild text
      _
    
    _.asDOM = _.dom = ->
      _.e
    
    _.asHTML = ->
      t = d.createElement("div")
      t.appendChild _.e
      t.innerHTML
    
    _.asText = ->
      t = d.createElement("div")
      t.appendChild _.e
      if t.innerText
        t.innerText
      else t.textContent  if t.textContent
    
    _
  
  window.DOMBuilder = (elem, attr) ->
    new X(elem, attr)
  
  window.DOMBuilder.DOM = (nodes) ->
    f = document.createDocumentFragment()
    n = new X("div")._(nodes).dom().childNodes
    while n.length
      f.appendChild n[0]
    f
)()
