import Reactory from "@reactory/reactory-core";

type UploadVariables = {
  base64?: string
  file?: File,
  id?: string
}

type UploadResult = {
  url: string
  id: string
}


const useProfileImageImageUploader: Reactory.Client.ImageUploaderHook<string> = (props) => {
  
  const {
    reactory
  } = props;
  
  const { 
    React
  } = reactory.getComponents<{
    React: Reactory.React
  }>(['react.React']);

  const { useState, useEffect } = React as Reactory.React;
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'complete'>('idle');

  const upload = async (base64?: string, file?: File, id?: string): Promise<void> => {    
    setUploadStatus('uploading');
    try {
      const {
        data,
        error,
        errors,
      } = await reactory.graphqlQuery<UploadResult, UploadVariables>(`
      mutation UploadProfileImage($base64: String, $file: Upload, $id: String) {
        ReactoryUploadProfileImage(base64: $base64, file: $file, id: $id) {
          id
          url
        }
      }
     `,
        {
          base64,
          file,
          id,
        });

      if (error || errors) {
        setUploadError(new Error(error?.message || errors[0].message));
      }

      if (data) {
        if (onChange) onChange(data.url);
      }
      setUploadStatus('complete');
      setTimeout(() => {
        setUploadStatus('idle');
      }, 2500);
    } catch (err) {
      setUploadError(err);
      setUploadStatus('idle');
    }

    
  }

  return {
    upload,
    uploadError: uploadError?.message,
    uploadStatus,
  }
};

export default useProfileImageImageUploader;