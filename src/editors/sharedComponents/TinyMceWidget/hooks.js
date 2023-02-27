import { useState } from 'react';
import tinyMCEStyles from '../../data/constants/tinyMCEStyles';
import { StrictDict } from '../../utils';
import pluginConfig from './pluginConfig';
import * as module from './hooks';
import tinyMCE from '../../data/constants/tinyMCE';

import * as appHooks from '../../hooks';

export const { nullMethod, navigateCallback, navigateTo } = appHooks;

export const state = StrictDict({
  isImageModalOpen: (val) => useState(val),
  isSourceCodeModalOpen: (val) => useState(val),
  imageSelection: (val) => useState(val),
});

export const parseContentForLabels = ({ editor, updateQuestion }) => {
  let content = editor.getContent();
  if (content && content?.length > 0) {
    const parsedLabels = content.split(/<label>|<\/label>/gm);
    let updatedContent;
    parsedLabels.forEach((label, i) => {
      let updatedLabel = label;
      if (!label.startsWith('<') && !label.endsWith('>')) {
        let previousLabel = parsedLabels[i - 1];
        let nextLabel = parsedLabels[i + 1];
        if (!previousLabel.endsWith('<p>')) {
          previousLabel = `${previousLabel}</p><p>`;
          updatedContent = content.replace(parsedLabels[i - 1], previousLabel);
          content = updatedContent;
        }
        if (previousLabel.endsWith('</p>') && !label.startWith('<p>')) {
          updatedLabel = `<p>${label}`;
          updatedContent = content.replace(label, updatedLabel);
          content = updatedContent;
        }
        if (!nextLabel.startsWith('</p>')) {
          nextLabel = `</p><p>${nextLabel}`;
          updatedContent = content.replace(parsedLabels[i + 1], nextLabel);
          content = updatedContent;
        }
      }
    });
  }
  updateQuestion(content);
};

export const replaceStaticwithAsset = (editor, imageUrls) => {
  const content = editor.getContent();
  const imageSrcs = content.split('src="');
  imageSrcs.forEach(src => {
    if (src.startsWith('/static/') && imageUrls.length > 0) {
      const imgName = src.substring(8, src.indexOf('"'));
      let staticFullUrl;
      imageUrls.forEach((url) => {
        if (imgName === url.displayName) {
          staticFullUrl = url.staticFullUrl;
        }
      });
      if (staticFullUrl) {
        const currentSrc = src.substring(0, src.indexOf('"'));
        const updatedContent = content.replace(currentSrc, staticFullUrl);
        editor.setContent(updatedContent);
      }
    }
  });
};

export const setupCustomBehavior = ({
  updateQuestion,
  openImgModal,
  openSourceCodeModal,
  setImage,
  editorType,
}) => (editor) => {
  // image upload button
  editor.ui.registry.addButton(tinyMCE.buttons.imageUploadButton, {
    icon: 'image',
    tooltip: 'Add Image',
    onAction: openImgModal,
  });
  // editing an existing image
  editor.ui.registry.addButton(tinyMCE.buttons.editImageSettings, {
    icon: 'image',
    tooltip: 'Edit Image Settings',
    onAction: module.openModalWithSelectedImage({ editor, setImage, openImgModal }),
  });
  // overriding the code plugin's icon with 'HTML' text
  editor.ui.registry.addButton(tinyMCE.buttons.code, {
    text: 'HTML',
    tooltip: 'Source code',
    onAction: openSourceCodeModal,
  });
  // add a custom simple inline code block formatter.
  const setupCodeFormatting = (api) => {
    editor.formatter.formatChanged(
      'code',
      (active) => api.setActive(active),
    );
  };
  const toggleCodeFormatting = () => {
    editor.formatter.toggle('code');
    editor.undoManager.add();
    editor.focus();
  };
  editor.ui.registry.addToggleButton(tinyMCE.buttons.codeBlock, {
    icon: 'sourcecode',
    tooltip: 'Code Block',
    onAction: toggleCodeFormatting,
    onSetup: setupCodeFormatting,
  });
  // add a custom simple inline label formatter.
  const toggleLabelFormatting = () => {
    editor.execCommand('mceToggleFormat', false, 'label');
  };
  editor.ui.registry.addIcon('textToSpeech',
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 22C3.08333 22 2.72917 21.8542 2.4375 21.5625C2.14583 21.2708 2 20.9167 2 20.5V3.5C2 3.08333 2.14583 2.72917 2.4375 2.4375C2.72917 2.14583 3.08333 2 3.5 2H13L11.5 3.5H3.5V20.5H15.5V17H17V20.5C17 20.9167 16.8542 21.2708 16.5625 21.5625C16.2708 21.8542 15.9167 22 15.5 22H3.5ZM6 17.75V16.25H13V17.75H6ZM6 14.75V13.25H11V14.75H6ZM15.5 15L11.5 11H8V6H11.5L15.5 2V15ZM17 12.7V4.05C17.9333 4.4 18.6667 5.01667 19.2 5.9C19.7333 6.78333 20 7.65 20 8.5C20 9.35 19.7083 10.1917 19.125 11.025C18.5417 11.8583 17.8333 12.4167 17 12.7ZM17 16.25V14.7C18.1667 14.2833 19.2083 13.5333 20.125 12.45C21.0417 11.3667 21.5 10.05 21.5 8.5C21.5 6.95 21.0417 5.63333 20.125 4.55C19.2083 3.46667 18.1667 2.71667 17 2.3V0.75C18.7 1.2 20.125 2.1375 21.275 3.5625C22.425 4.9875 23 6.63333 23 8.5C23 10.3667 22.425 12.0125 21.275 13.4375C20.125 14.8625 18.7 15.8 17 16.25Z" fill="black"/></svg>');
  editor.ui.registry.addButton('customLabelButton', {
    icon: 'textToSpeech',
    text: 'Label',
    tooltip: 'Apply a "Question" label to specific text, recognized by screen readers. Recommended to improve accessibility.',
    onAction: toggleLabelFormatting,
  });
  editor.on('blur', () => {
    if (editorType === 'problem') {
      module.parseContentForLabels({
        editor,
        updateQuestion,
      });
    }
  });
};

export const checkRelativeUrl = (imageUrls) => (editor) => {
  editor.on('ExecCommand', (e) => {
    if (e.command === 'mceFocus') {
      module.replaceStaticwithAsset(editor, imageUrls);
    }
  });
};

// imagetools_cors_hosts needs a protocol-sanatized url
export const removeProtocolFromUrl = (url) => url.replace(/^https?:\/\//, '');

export const editorConfig = ({
  editorType,
  setEditorRef,
  textValue,
  images,
  lmsEndpointUrl,
  studioEndpointUrl,
  isLibrary,
  placeholder,
  initializeEditor,
  openImgModal,
  openSourceCodeModal,
  setSelection,
  updateQuestion,
  minHeight,
}) => {
  const {
    toolbar,
    config,
    plugins,
    imageToolbar,
  } = pluginConfig({ isLibrary, placeholder, editorType });
  return {
    onInit: (evt, editor) => {
      setEditorRef(editor);
      if (editorType === 'text') {
        initializeEditor();
      }
    },
    initialValue: textValue || '',
    init: {
      ...config,
      skin: false,
      content_css: false,
      content_style: tinyMCEStyles,
      min_height: minHeight,
      contextmenu: 'link table',
      document_base_url: lmsEndpointUrl,
      init_instance_callback: module.checkRelativeUrl(module.fetchImageUrls(images)),
      imagetools_cors_hosts: [removeProtocolFromUrl(lmsEndpointUrl), removeProtocolFromUrl(studioEndpointUrl)],
      imagetools_toolbar: imageToolbar,
      formats: { label: { inline: 'label' } },
      setup: module.setupCustomBehavior({
        editorType,
        updateQuestion,
        openImgModal,
        openSourceCodeModal,
        setImage: setSelection,
      }),
      toolbar,
      plugins,
      valid_children: '+body[style]',
      valid_elements: '*[*]',
      entity_encoding: 'utf-8',
    },
  };
};

export const imgModalToggle = () => {
  const [isImgOpen, setIsOpen] = module.state.isImageModalOpen(false);
  return {
    isImgOpen,
    openImgModal: () => setIsOpen(true),
    closeImgModal: () => setIsOpen(false),
  };
};

export const sourceCodeModalToggle = (editorRef) => {
  const [isSourceCodeOpen, setIsOpen] = module.state.isSourceCodeModalOpen(false);
  return {
    isSourceCodeOpen,
    openSourceCodeModal: () => setIsOpen(true),
    closeSourceCodeModal: () => {
      setIsOpen(false);
      editorRef.current.focus();
    },
  };
};

export const openModalWithSelectedImage = ({ editor, setImage, openImgModal }) => () => {
  const imgHTML = editor.selection.getNode();
  setImage({
    externalUrl: imgHTML.src,
    altText: imgHTML.alt,
    width: imgHTML.width,
    height: imgHTML.height,
  });
  openImgModal();
};

export const filterAssets = ({ assets }) => {
  let images = [];
  const assetsList = Object.values(assets);
  if (assetsList.length > 0) {
    images = assetsList.filter(asset => asset?.contentType?.startsWith('image/'));
  }
  return images;
};

export const setAssetToStaticUrl = ({ editorValue, assets }) => {
  /* For assets to remain usable across course instances, we convert their url to be course-agnostic.
   * For example, /assets/course/<asset hash>/filename gets converted to /static/filename. This is
   * important for rerunning courses and importing/exporting course as the /static/ part of the url
   * allows the asset to be mapped to the new course run.
  */
  let content = editorValue;
  const assetUrls = [];
  const assetsList = Object.values(assets);
  assetsList.forEach(asset => {
    assetUrls.push({ portableUrl: asset.portableUrl, displayName: asset.displayName });
  });
  const assetSrcs = typeof content === 'string' ? content.split(/(src="|href=")/g) : [];
  assetSrcs.forEach(src => {
    if (src.startsWith('/asset') && assetUrls.length > 0) {
      const assetBlockName = src.substring(src.indexOf('@') + 1, src.indexOf('"'));
      const nameFromEditorSrc = assetBlockName.substring(assetBlockName.indexOf('@') + 1);
      const nameFromStudioSrc = assetBlockName.substring(assetBlockName.indexOf('/') + 1);
      let portableUrl;
      assetUrls.forEach((url) => {
        const displayName = url.displayName.replace(/\s/g, '_');
        if (displayName === nameFromEditorSrc || displayName === nameFromStudioSrc) {
          portableUrl = url.portableUrl;
        }
      });
      if (portableUrl) {
        const currentSrc = src.substring(0, src.indexOf('"'));
        const updatedContent = content.replace(currentSrc, portableUrl);
        content = updatedContent;
      }
    }
  });
  return content;
};

export const fetchImageUrls = (images) => {
  const imageUrls = [];
  images.forEach(image => {
    imageUrls.push({ staticFullUrl: image.staticFullUrl, displayName: image.displayName });
  });
  return imageUrls;
};

export const selectedImage = (val) => {
  const [selection, setSelection] = module.state.imageSelection(val);
  return {
    clearSelection: () => setSelection(null),
    selection,
    setSelection,
  };
};
