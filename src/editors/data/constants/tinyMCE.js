import { StrictDict } from '../../utils';

const listKeyStore = (list) => StrictDict(
  list.reduce((obj, val) => ({ ...obj, [val]: val }), {}),
);

export const commands = StrictDict({
  insertContent: 'mceInsertContent',
});

export const buttons = StrictDict({
  addImageButton: 'addimagebutton',
  blockQuote: 'blockquote',
  codeBlock: 'codeBlock',
  align: StrictDict({
    center: 'aligncenter',
    justify: 'alignjustify',
    left: 'alignleft',
    right: 'alignright',
  }),
  foreColor: 'forecolor',
  backColor: 'backcolor',
  bold: 'bold',
  bullist: 'bullist',
  charmap: 'charmap',
  code: 'code-modified', // use a custom button name, consistently, for our text-only button
  codesample: 'codesample',
  customLabelButton: 'customLabelButton',
  editImageSettings: 'editimagesettings',
  emoticons: 'emoticons',
  flip: StrictDict({
    vert: 'flipv',
    horiz: 'fliph',
  }),
  formatSelect: 'formatSelect',
  hr: 'hr',
  imageUploadButton: 'imageuploadbutton',
  indent: 'indent',
  italic: 'italic',
  link: 'link',
  unlink: 'unlink',
  numlist: 'numlist',
  outdent: 'outdent',
  redo: 'redo',
  removeFormat: 'removeformat',
  rotate: StrictDict({
    left: 'rotateleft',
    right: 'rotateright',
  }),
  table: 'table',
  undo: 'undo',
  underline: 'underline',
});

export const plugins = listKeyStore([
  'link',
  'lists',
  'codesample',
  'emoticons',
  'table',
  'hr',
  'charmap',
  'code',
  'autoresize',
  'image',
  'imagetools',
]);

export default StrictDict({
  buttons,
  commands,
  plugins,
});
