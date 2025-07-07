import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import appConfig from '@/appConfig';
import uploadButton from '@/components/website/uploadButton';
import { fileDeleteWithPhoto, uploadFile } from '@/lib/apis/file';
import { handlePreview, handlePreviewCancel, normFile } from '@/lib/utils/commonFunctions';
import { errorNotification } from '@/lib/utils/notification';
import { selectGlobal } from '@/redux/features/global/globalSlice';
import { Form, Image, Input, Modal, Upload } from 'antd';

export default function ImageUpload({ formValues, form, setFormValues }: any) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const customUploadRequest = async (options: any) => {
    const { filename, file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append(filename, file);

    try {
      const res = await uploadFile(formData);

      if (!res || !res.data) {
        errorNotification({ message: res.message });
      }

      const newfile = res.data.map((item: { filename: string }) => ({
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: item.filename,
        url: `${appConfig.baseApiUrl}/uploads/${item.filename}`,
      }));

      const newFileName = res.data.length ? res.data[0].filename : null;
      // Assuming you're updating form data here:
      if (filename === "images") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileList: [...form.getFieldsValue().fileList, ...newfile],
          images: [...form.getFieldsValue().images, newFileName],
        });
        setFormValues({
          ...formValues,
          fileList: [...formValues.fileList, ...newfile],
          images: [...formValues.images, newFileName],
        });
      }

      if (filename === "thumbnailImage") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileThumbnailList: newfile,
          thumbnailImage: newFileName,
        });
        setFormValues({
          ...formValues,
          fileThumbnailList: newfile,
          thumbnailImage: newFileName,
        });
      }

      if (filename === "hoverImage") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileHoverList: newfile,
          hoverImage: newFileName,
        });
        setFormValues({
          ...formValues,
          fileHoverList: newfile,
          hoverImage: newFileName,
        });
      }

      onSuccess("Ok");
    } catch (err) {
      console.error("🚀 ~ Upload error:", err);
      onError({ err });
    }
  };
  return (
    <>
      <div className="flex justify-between">
        <div>
          <Form.Item
            name="fileThumbnailList"
            label="Thumbnail Image"
            valuePropName="fileThumbnailList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: "Thumbnail Image is required",
              },
            ]}
          >
            <ImgCrop rotationSlider showReset>
              <Upload
                name="thumbnailImage"
                listType="picture-card"
                fileList={formValues?.fileThumbnailList || []}
                onRemove={async (v) => {
                  if (v.fileName) {
                    form.setFieldsValue({
                      ...form.getFieldsValue(),
                      thumbnailImage: null,
                      fileThumbnailList: [],
                    });
                    setFormValues({
                      ...formValues,
                      thumbnailImage: null,
                      fileThumbnailList: [],
                    });
                    const params = { filename: v.fileName };
                    await fileDeleteWithPhoto(params);
                  }
                }}
                className="avatar-uploader"
                onPreview={(file) => handlePreview(file, dispatch)}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {!formValues.thumbnailImage && uploadButton}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item name="thumbnailImage" hidden>
            <Input />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            name="fileHoverList"
            label="Hover Image"
            valuePropName="fileHoverList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: "Hover Image is required",
              },
            ]}
          >
            <ImgCrop rotationSlider showReset>
              <Upload
                name="hoverImage"
                listType="picture-card"
                fileList={formValues?.fileHoverList || []}
                onRemove={async (v) => {
                  if (v.fileName) {
                    form.setFieldsValue({
                      ...form.getFieldsValue(),
                      hoverImage: null,
                      fileHoverList: [],
                    });
                    setFormValues({
                      ...formValues,
                      hoverImage: null,
                      fileHoverList: [],
                    });
                    const params = { filename: v.fileName };
                    await fileDeleteWithPhoto(params);
                  }
                }}
                className="avatar-uploader"
                onPreview={(file) => handlePreview(file, dispatch)}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {!formValues.hoverImage && uploadButton}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item name="hoverImage" hidden>
            <Input />
          </Form.Item>
        </div>
      </div>
      <div>
        <Form.Item
          name="fileList"
          label="Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Images is required",
            },
          ]}
        >
          <ImgCrop rotationSlider showReset>
            <Upload
              name="images"
              listType="picture-card"
              fileList={formValues?.fileList || []}
              onRemove={async (v) => {
                const find = (form.getFieldValue("images") || []).filter(
                  (item: string) => item !== v.fileName
                );
                const newfind = (
                  form.getFieldValue("fileList") || []
                ).filter(
                  (item: { fileName: string }) =>
                    item.fileName !== v.fileName
                );
                form.setFieldsValue({ images: find, fileList: newfind });
                setFormValues({
                  ...formValues,
                  images: find,
                  fileList: newfind,
                });
                if (v.fileName) {
                  const params = { filename: v.fileName };
                  await fileDeleteWithPhoto(params);
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={customUploadRequest}
              maxCount={5}
            >
              {uploadButton}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item name="images" hidden>
          <Input />
        </Form.Item>

        <Modal
          open={global.previewOpen}
          title={global.previewTitle}
          footer={null}
          onCancel={() => handlePreviewCancel(dispatch)}
        >
          <Image
            alt="example"
            style={{
              width: "100%",
            }}
            src={global.previewImage}
            preview={false}
          />
        </Modal>
      </div>
    </>
  )
}
