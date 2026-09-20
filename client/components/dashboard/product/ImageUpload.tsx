import uploadButton from '@/components/share-component/uploadButton';
import { fileDeleteWithPhoto } from '@/lib/apis/file';
import { handlePreview, handlePreviewCancel, normFile } from '@/lib/utils/commonFunctions';
import { handleGlobalUpload } from '@/lib/utils/handleGlobalUpload';
import { selectGlobal } from '@/redux/features/global/globalSlice';
import { Form, Image, Input, Modal, Upload } from 'antd';
import { FiImage } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';


export default function ImageUpload({ formValues, form, setFormValues }: any) {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const customUploadRequest = async (options: any) => {
    const { filename } = options;
    const result = await handleGlobalUpload(options);

    if (result) {
      const { newFile, newFileName } = result;
      const newFiles = [newFile];

      if (filename === "images") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileList: [...(form.getFieldsValue().fileList || []), ...newFiles],
          images: [...(form.getFieldsValue().images || []), newFileName],
        });
        setFormValues({
          ...formValues,
          fileList: [...(formValues.fileList || []), ...newFiles],
          images: [...(formValues.images || []), newFileName],
        });
      }

      if (filename === "thumbnailImage") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileThumbnailList: newFiles,
          thumbnailImage: newFileName,
        });
        setFormValues({
          ...formValues,
          fileThumbnailList: newFiles,
          thumbnailImage: newFileName,
        });
      }

      if (filename === "hoverImage") {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          fileHoverList: newFiles,
          hoverImage: newFileName,
        });
        setFormValues({
          ...formValues,
          fileHoverList: newFiles,
          hoverImage: newFileName,
        });
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Thumbnail + Hover — side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Thumbnail */}
        <div>
          <Form.Item
            name="fileThumbnailList"
            label={
              <span className="flex items-center gap-1 text-xs font-semibold text-global-primary">
                <FiImage className="w-3.5 h-3.5 text-global-secondary" />
                Thumbnail <span className="text-red-500">*</span>
              </span>
            }
            valuePropName="fileThumbnailList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Thumbnail is required" }]}
            className="mb-0"
          >
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
                  await fileDeleteWithPhoto({ filename: v.fileName });
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={customUploadRequest}
              maxCount={1}
            >
              {!formValues.thumbnailImage && uploadButton}
            </Upload>
          </Form.Item>
          <p className="text-xs text-global-secondary mt-1">
            1:1 ratio · Max 2MB
          </p>
          <Form.Item name="thumbnailImage" hidden>
            <Input />
          </Form.Item>
        </div>

        {/* Hover Image */}
        <div>
          <Form.Item
            name="fileHoverList"
            label={
              <span className="flex items-center gap-1 text-xs font-semibold text-global-primary">
                <FiImage className="w-3.5 h-3.5 text-global-secondary" />
                Hover Image <span className="text-red-500">*</span>
              </span>
            }
            valuePropName="fileHoverList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Hover image is required" }]}
            className="mb-0"
          >
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
                  await fileDeleteWithPhoto({ filename: v.fileName });
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={customUploadRequest}
              maxCount={1}
            >
              {!formValues.hoverImage && uploadButton}
            </Upload>
          </Form.Item>
          <p className="text-xs text-global-secondary mt-1">
            Shown on card hover · Max 2MB
          </p>
          <Form.Item name="hoverImage" hidden>
            <Input />
          </Form.Item>
        </div>
      </div>

      {/* Gallery — full width with dashed border zone hint */}
      <div>
        <p className="text-xs font-semibold text-global-primary mb-1">
          Gallery Images <span className="text-red-500">*</span>
        </p>
        <p className="text-xs text-global-secondary mb-3">
          Upload up to 5 images. Drag to reorder. Recommended: 800×800px.
        </p>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 hover:border-gray-400 transition-colors">
          <Form.Item
            name="fileList"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "At least one gallery image is required" }]}
            className="mb-0"
          >
            <Upload
              name="images"
              listType="picture-card"
              fileList={formValues?.fileList || []}
              onRemove={async (v) => {
                const find = (form.getFieldValue("images") || []).filter(
                  (item: string) => item !== v.fileName
                );
                const newfind = (form.getFieldValue("fileList") || []).filter(
                  (item: { fileName: string }) => item.fileName !== v.fileName
                );
                form.setFieldsValue({ images: find, fileList: newfind });
                setFormValues({
                  ...formValues,
                  images: find,
                  fileList: newfind,
                });
                if (v.fileName) {
                  await fileDeleteWithPhoto({ filename: v.fileName });
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={customUploadRequest}
              maxCount={5}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
        </div>
        <Form.Item name="images" hidden>
          <Input />
        </Form.Item>
      </div>

      {/* Preview modal */}
      <Modal
        open={global.previewOpen}
        title={global.previewTitle}
        footer={null}
        onCancel={() => handlePreviewCancel(dispatch)}
      >
        <Image
          alt="preview"
          style={{ width: "100%" }}
          src={global.previewImage}
          preview={false}
        />
      </Modal>
    </div>
  );
}
