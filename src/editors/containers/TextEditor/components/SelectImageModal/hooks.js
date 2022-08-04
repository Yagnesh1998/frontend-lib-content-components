import React from 'react';
import { useDispatch } from 'react-redux';

import { thunkActions } from '../../../../data/redux';
import * as module from './hooks';
import { sortFunctions, sortKeys } from './utils';

export const state = {
  highlighted: (val) => React.useState(val),
  images: (val) => React.useState(val),
  showSelectImageError: (val) => React.useState(val),
  searchString: (val) => React.useState(val),
  sortBy: (val) => React.useState(val),
  showSizeError: (val) => React.useState(val),
};

export const searchAndSortHooks = () => {
  const [searchString, setSearchString] = module.state.searchString('');
  const [sortBy, setSortBy] = module.state.sortBy(sortKeys.dateNewest);
  return {
    searchString,
    onSearchChange: (e) => setSearchString(e.target.value),
    clearSearchString: () => setSearchString(''),
    sortBy,
    onSortClick: (key) => () => setSortBy(key),
  };
};

export const filteredList = ({ searchString, imageList }) => (
  imageList.filter(({ displayName }) =>displayName.toLowerCase().includes(searchString.toLowerCase()))
);

export const displayList = ({ sortBy, searchString, images }) =>
  module.filteredList({
      searchString,
      imageList: Object.values(images),
    }).sort(sortFunctions[sortBy in sortKeys ? sortKeys[sortBy] : sortKeys.dateNewest]);

export const imgListHooks = ({ searchSortProps, setSelection }) => {
  const dispatch = useDispatch();
  const [images, setImages] = module.state.images({});
  const [highlighted, setHighlighted] = module.state.highlighted(null);
  const [
    showSelectImageError,
    setShowSelectImageError,
  ] = module.state.showSelectImageError(false);
  const [showSizeError, setShowSizeError] = module.state.showSelectImageError(false);
  const list = module.displayList({ ...searchSortProps, images });

  React.useEffect(() => {
    dispatch(thunkActions.app.fetchImages({ setImages }));
  }, []);

  return {
    galleryError: {
      show: showSelectImageError,
      set: () => setShowSelectImageError(true),
      dismiss: () => setShowSelectImageError(false),
    },
    inputError: {
      show: showSizeError,
      set: () => setShowSizeError(true),
      dismiss: () => setShowSizeError(false),
    },
    images,
    galleryProps: {
      galleryIsEmpty: Object.keys(images).length === 0,
      searchIsEmpty: list.length === 0,
      displayList: list,
      highlighted,
      onHighlightChange: (e) => setHighlighted(e.target.value),
    },
    // highlight by id
    selectBtnProps: {
      onClick: () => {
        if (highlighted) {
          setSelection(images[highlighted]);
        } else {
          setShowSelectImageError(true);
        }
      },
    },
  };
};

export const checkValidFileSize = ({
  selectedFile,
  clearSelection,
  onSizeFail,
}) => {
  const fileSize = (selectedFile.size / 1000000).toFixed(4);
  if (fileSize > 10) {
    clearSelection();
    onSizeFail();
    return false;
  }
  return true;
};

export const fileInputHooks = ({ setSelection, clearSelection, imgList }) => {
  const dispatch = useDispatch();
  const ref = React.useRef();
  const click = () => ref.current.click();
  const addFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && module.checkValidFileSize({
        selectedFile,
        clearSelection,
        onSizeFail: () => {
          imgList.inputError.set();
        },
      })
    ) {
      dispatch(
        thunkActions.app.uploadImage({
          file: selectedFile,
          setSelection,
        }),
      );
    }
  };

  return {
    click,
    addFile,
    ref,
  };
};

export const imgHooks = ({ setSelection, clearSelection }) => {
  const searchSortProps = module.searchAndSortHooks();
  const imgList = module.imgListHooks({ setSelection, searchSortProps });
  const fileInput = module.fileInputHooks({
    setSelection,
    clearSelection,
    imgList,
  });
  const {
    galleryError,
    galleryProps,
    inputError,
    selectBtnProps,
  } = imgList;

  return {
    galleryError,
    inputError,
    fileInput,
    galleryProps,
    searchSortProps,
    selectBtnProps,
  };
};

export default {
  imgHooks,
};
