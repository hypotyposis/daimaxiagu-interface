// Editor: https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
// Import library.xml to edit custom block, export Definition with block and python code generator
// Import toolbox.xml to edit toolbox, export xml and convernt it to json using script

export const convernter = s => {
  const serializer = new XMLSerializer();
  const recursiveConvernter = xml => {
    const item = {};
    for (const { name, value } of xml.attributes) {
      item[name] = value;
    }
    if (xml.tagName !== 'xml') {
      item.kind = xml.tagName.toUpperCase();
    }
    switch (item.kind) {
      case undefined:
      case 'CATEGORY': {
        if (xml.childElementCount > 0) {
          const contents = [];
          for (const node of xml.children) {
            contents.push(recursiveConvernter(node));
          }
          item.contents = contents;
        }
        break;
      }
      case 'BLOCK':
      default: {
        item.blockxml = serializer.serializeToString(xml);
        break;
      }
    }
    return item;
  };
  return recursiveConvernter(
    new DOMParser().parseFromString(s, 'text/xml').children[0],
  );
};
