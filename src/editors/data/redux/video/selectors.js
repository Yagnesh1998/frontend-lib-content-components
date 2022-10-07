import { createSelector } from 'reselect';

import { keyStore } from '../../../utils';
import { videoTranscriptLanguages } from '../../constants/video';

import { initialState } from './reducer';
import * as module from './selectors';
import * as AppSelectors from '../app/selectors';
import { downloadVideoTranscriptURL } from '../../services/cms/urls';

const stateKeys = keyStore(initialState);

export const video = (state) => state.video;

export const simpleSelectors = [
  stateKeys.videoSource,
  stateKeys.videoId,
  stateKeys.fallbackVideos,
  stateKeys.allowVideoDownloads,
  stateKeys.thumbnail,
  stateKeys.transcripts,
  stateKeys.allowTranscriptDownloads,
  stateKeys.duration,
  stateKeys.showTranscriptByDefault,
  stateKeys.handout,
  stateKeys.licenseType,
  stateKeys.licenseDetails,
  stateKeys.allowThumbnailUpload,
  stateKeys.originalThumbnail,
  stateKeys.videoType,
].reduce((obj, key) => ({ ...obj, [key]: state => state.video[key] }), {});

export const openLanguages = createSelector(
  [module.simpleSelectors.transcripts],
  (transcripts) => {
    const open = Object.entries(videoTranscriptLanguages).filter(
      ([lang]) => !Object.keys(transcripts).includes(lang),
    );
    return open;
  },
);

export const getTranscriptDownloadUrl = createSelector(
  [AppSelectors.simpleSelectors.studioEndpointUrl, AppSelectors.simpleSelectors.blockId],
  (studioEndpointUrl, blockId) => ({ language }) => downloadVideoTranscriptURL({
    studioEndpointUrl,
    blockId,
    language,
  }),
);

export const videoSettings = createSelector(
  Object.values(module.simpleSelectors),
  (
    videoSource,
    videoId,
    fallbackVideos,
    allowVideoDownloads,
    thumbnail,
    transcripts,
    allowTranscriptDownloads,
    duration,
    showTranscriptByDefault,
    handout,
    licenseType,
    licenseDetails,
  ) => (
    {
      videoSource,
      videoId,
      fallbackVideos,
      allowVideoDownloads,
      thumbnail,
      transcripts,
      allowTranscriptDownloads,
      duration,
      showTranscriptByDefault,
      handout,
      licenseType,
      licenseDetails,
    }
  ),
);

export default {
  openLanguages,
  getTranscriptDownloadUrl,
  ...simpleSelectors,
  videoSettings,
};
