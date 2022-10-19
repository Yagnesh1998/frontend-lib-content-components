import { StrictDict } from '../../utils';

export const RequestStates = StrictDict({
  inactive: 'inactive',
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
});

export const RequestKeys = StrictDict({
  fetchAssets: 'fetchAssets',
  fetchBlock: 'fetchBlock',
  fetchImages: 'fetchImages',
  fetchStudioView: 'fetchStudioView',
  fetchUnit: 'fetchUnit',
  saveBlock: 'saveBlock',
  uploadImage: 'uploadImage',
  allowThumbnailUpload: 'allowThumbnailUpload',
  uploadThumbnail: 'uploadThumbnail',
  uploadTranscript: 'uploadTranscript',
  deleteTranscript: 'deleteTranscript',
});
