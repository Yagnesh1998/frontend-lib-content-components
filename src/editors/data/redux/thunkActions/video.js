import { actions, selectors } from '..';
import { removeItemOnce } from '../../../utils';
import * as requests from './requests';
import * as module from './video';

export const loadVideoData = () => (dispatch, getState) => {
  const state = getState();
  const rawVideoData = state.app.blockValue.data.metadata ? state.app.blockValue.data.metadata : {};
  const courseLicenseData = state.app.courseDetails.data ? state.app.courseDetails.data : {};
  const studioView = state.app.studioView?.data?.html;
  const {
    videoSource,
    videoType,
    videoId,
    fallbackVideos,
  } = module.determineVideoSource({
    edxVideoId: rawVideoData.edx_video_id,
    youtubeId: rawVideoData.youtube_id_1_0,
    html5Sources: rawVideoData.html5_sources,
  });
  const [licenseType, licenseOptions] = module.parseLicense({ licenseData: studioView, level: 'block' });
  const transcripts = module.parseTranscripts({ transcriptsData: studioView });
  console.log('transcripts');
  const [courseLicenseType, courseLicenseDetails] = module.parseLicense({
    licenseData: courseLicenseData.license,
    level: 'course',
  });

  dispatch(actions.video.load({
    videoSource,
    videoType,
    videoId,
    fallbackVideos,
    allowVideoDownloads: rawVideoData.download_video,
    transcripts,
    allowTranscriptDownloads: rawVideoData.download_track,
    showTranscriptByDefault: rawVideoData.show_captions,
    duration: { // TODO duration is not always sent so they should be calculated.
      startTime: rawVideoData.start_time,
      stopTime: rawVideoData.end_time,
      total: null, // TODO can we get total duration? if not, probably dropping from widget
    },
    handout: rawVideoData.handout,
    licenseType,
    licenseDetails: {
      attribution: licenseOptions.by,
      noncommercial: licenseOptions.nc,
      noDerivatives: licenseOptions.nd,
      shareAlike: licenseOptions.sa,
    },
    courseLicenseType,
    courseLicenseDetails: {
      attribution: courseLicenseDetails.by,
      noncommercial: courseLicenseDetails.nc,
      noDerivatives: courseLicenseDetails.nd,
      shareAlike: courseLicenseDetails.sa,
    },
    thumbnail: rawVideoData.thumbnail,
  }));
  dispatch(requests.allowThumbnailUpload({
    onSuccess: (response) => dispatch(actions.video.updateField({
      allowThumbnailUpload: response.data.allowThumbnailUpload,
    })),
  }));
};

export const determineVideoSource = ({
  edxVideoId,
  youtubeId,
  html5Sources,
}) => {
  // videoSource should be the edx_video_id, the youtube url or the first fallback url in that order.
  // If we are falling back to the first fallback url, remove it from the list of fallback urls for display.
  const youtubeUrl = `https://youtu.be/${youtubeId}`;
  const videoId = edxVideoId || '';
  let videoSource = '';
  let videoType = '';
  let fallbackVideos = [];
  if (youtubeId) {
    // videoSource = youtubeUrl;
    // fallbackVideos = html5Sources;
    [videoSource, fallbackVideos] = [youtubeUrl, html5Sources];
    videoType = 'youtube';
  } else if (edxVideoId) {
    // videoSource = edxVideoId;
    // fallbackVideos = html5Sources;
    [videoSource, fallbackVideos] = [edxVideoId, html5Sources];
    videoType = 'edxVideo';
  } else if (Array.isArray(html5Sources) && html5Sources[0]) {
    // videoSource = html5Sources[0];
    // fallbackVideos = html5Sources.slice(1);
    [videoSource, fallbackVideos] = [html5Sources[0], html5Sources.slice(1)];
    videoType = 'html5source';
  }
  if (fallbackVideos.length === 0) {
    fallbackVideos = ['', ''];
  }
  return {
    videoSource,
    videoType,
    videoId,
    fallbackVideos,
  };
};

export const parseTranscripts = ({ transcriptsData }) => {
  if (!transcriptsData) {
    return [];
  }
  const startString = 'language.", "value": ';
  const cleanedStr = transcriptsData.replace(/&#34;/g, '"');
  const metadataStr = cleanedStr.substring(cleanedStr.indexOf(startString) + startString.length, cleanedStr.indexOf(', "type": "VideoTranslations"'));
  console.log(metadataStr);
  return Object.keys(JSON.parse(metadataStr));
};

// partially copied from frontend-app-learning/src/courseware/course/course-license/CourseLicense.jsx
export const parseLicense = ({ licenseData, level }) => {
  if (!licenseData) {
    return [null, {}];
  }
  let license = licenseData;
  if (level === 'block') {
    const metadataArr = licenseData.split('data-metadata');
    metadataArr.forEach(arr => {
      const parsedStr = arr.replace(/&#34;/g, '"');
      if (parsedStr.includes('license')) {
        license = parsedStr.substring(parsedStr.indexOf('"value"'), parsedStr.indexOf(', "type"')).replace(/"value": |"/g, '');
      }
    });
  }
  if (!license || license.includes('null')) {
    return [null, {}];
  }
  if (license === 'all-rights-reserved') {
    // no options, so the entire thing is the license type
    return [license, {}];
  }
  // Search for a colon character denoting the end
  // of the license type and start of the options
  const colonIndex = license.lastIndexOf(':');
  // Split the license on the colon
  const licenseType = license.slice(0, colonIndex).trim();
  const optionStr = license.slice(colonIndex + 1).trim();
  const options = {};
  let version = '';

  // Set the defaultVersion to 4.0
  const defaultVersion = '4.0';
  optionStr.split(' ').forEach(option => {
    // Split the option into key and value
    // Default the value to `true` if no value
    let key = '';
    let value = '';
    if (option.indexOf('=') !== -1) {
      [key, value] = option.split('=');
    } else {
      key = option;
      value = true;
    }

    // Check for version
    if (key === 'ver') {
      version = value;
    } else {
      // Set the option key to lowercase to make
      // it easier to query
      options[key.toLowerCase()] = value;
    }
  });

  // Set the version to whatever was included,
  // using `defaultVersion` as a fallback if unset
  version = version || defaultVersion;

  return [licenseType, options, version];
};

export const saveVideoData = () => (dispatch, getState) => {
  const state = getState();
  return selectors.video.videoSettings(state);
};

export const uploadThumbnail = ({ thumbnail }) => (dispatch, getState) => {
  const state = getState();
  const { videoId } = state.video;
  const { studioEndpointUrl } = state.app;
  dispatch(requests.uploadThumbnail({
    thumbnail,
    videoId,
    onSuccess: (response) => {
      const thumbnailUrl = studioEndpointUrl + response.data.image_url;
      dispatch(actions.video.updateField({
        thumbnail: thumbnailUrl,
      }));
    },
    onFailure: (e) => console.log({ UploadFailure: e }, 'Resampling thumbnail upload'),
  }));
};

// Handout Thunks:

export const uploadHandout = ({ file }) => (dispatch) => {
  dispatch(requests.uploadAsset({
    asset: file,
    onSuccess: (response) => {
      const handout = response.data.asset.url;
      dispatch(actions.video.updateField({ handout }));
    },
  }));
};

// Transcript Thunks:

export const uploadTranscript = ({ language, file }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  console.log({ roastBeast: transcripts });
  // Remove the placeholder '' from the unset language from the list of transcripts.
  const transcriptsPlaceholderRemoved = (transcripts === []) ? transcripts : removeItemOnce(transcripts, '');

  dispatch(requests.uploadTranscript({
    language,
    videoId,
    transcript: file,
    onSuccess: (response) => {
      dispatch(actions.video.updateField({
        transcripts: [
          ...transcriptsPlaceholderRemoved,
          language],
      }));
      if (selectors.video.videoId(state) === '') {
        dispatch(actions.video.updateField({
          videoId: response.data.edx_video_id,
        }));
      }
    },
  }));
};

export const deleteTranscript = ({ language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      const updatedTranscripts = transcripts.filter((code) => code !== language);
      console.log({ updatedTranscripts });
      dispatch(actions.video.updateField({ transcripts: updatedTranscripts }));
    },
  }));
};

export const updateTranscriptLanguage = ({ newLanguageCode, languageBeforeChange }) => (dispatch, getState) => {
  const state = getState();
  const { video: { transcripts, videoId } } = state;
  selectors.video.getTranscriptDownloadUrl(state);
  dispatch(requests.getTranscriptFile({
    videoId,
    language: languageBeforeChange,
    onSuccess: (response) => {
      console.log({ response });
      dispatch(requests.updateTranscriptLanguage({
        languageBeforeChange,
        file: new File([new Blob([response.data], { type: 'text/plain' })], `${videoId}_${newLanguageCode}.srt`, { type: 'text/plain' }),
        newLanguageCode,
        videoId,
        onSuccess: () => {
          const newTranscripts = transcripts
            .filter(transcript => transcript !== languageBeforeChange).append(newLanguageCode);
          dispatch(actions.video.updateField({ transcripts: newTranscripts }));
        },
      }));
    },
  }));
};

export const replaceTranscript = ({ newFile, newFilename, language }) => (dispatch, getState) => {
  const state = getState();
  const { videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      dispatch(uploadTranscript({ language, file: newFile, filename: newFilename }));
    },
  }));
};

export default {
  loadVideoData,
  determineVideoSource,
  parseLicense,
  saveVideoData,
  uploadThumbnail,
  uploadTranscript,
  deleteTranscript,
  updateTranscriptLanguage,
  replaceTranscript,
  uploadHandout,
};
