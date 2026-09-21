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

  const handleCustomUpload =
    (fieldName: "thumbnailImage" | "hoverImage" | "images") =>
    async (options: any) => {
      const result = await handleGlobalUpload({
        ...options,
        filename: fieldName,
      });

      if (result) {
        const { newFile, newFileName, newFileUrl } = result;
        const imageValue = newFileUrl || newFileName;
        const newFiles = [newFile];

        if (fieldName === "images") {
          const currentFileList = form.getFieldValue("fileList") || [];
          const currentImages = form.getFieldValue("images") || [];
          const updatedFileList = [...currentFileList, ...newFiles];
          const updatedImages = [...currentImages, imageValue];

          form.setFieldsValue({
            fileList: updatedFileList,
            images: updatedImages,
          });
          setFormValues((prev: any) => ({
            ...prev,
            fileList: updatedFileList,
            images: updatedImages,
          }));
        }

        if (fieldName === "thumbnailImage") {
          form.setFieldsValue({
            fileThumbnailList: newFiles,
            thumbnailImage: imageValue,
          });
          setFormValues((prev: any) => ({
            ...prev,
            fileThumbnailList: newFiles,
            thumbnailImage: imageValue,
          }));
        }

        if (fieldName === "hoverImage") {
          form.setFieldsValue({
            fileHoverList: newFiles,
            hoverImage: imageValue,
          });
          setFormValues((prev: any) => ({
            ...prev,
            fileHoverList: newFiles,
            hoverImage: imageValue,
          }));
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
              onRemove={async (v: any) => {
                const targetKey = v.fileName || v.name || v.url;
                form.setFieldsValue({
                  thumbnailImage: null,
                  fileThumbnailList: [],
                });
                setFormValues((prev: any) => ({
                  ...prev,
                  thumbnailImage: null,
                  fileThumbnailList: [],
                }));
                if (targetKey) {
                  await fileDeleteWithPhoto({ filename: targetKey });
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={handleCustomUpload("thumbnailImage")}
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
              onRemove={async (v: any) => {
                const targetKey = v.fileName || v.name || v.url;
                form.setFieldsValue({
                  hoverImage: null,
                  fileHoverList: [],
                });
                setFormValues((prev: any) => ({
                  ...prev,
                  hoverImage: null,
                  fileHoverList: [],
                }));
                if (targetKey) {
                  await fileDeleteWithPhoto({ filename: targetKey });
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={handleCustomUpload("hoverImage")}
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
              onRemove={async (v: any) => {
                const targetKey = v.fileName || v.name || v.url;
                const currentImages = form.getFieldValue("images") || [];
                const currentFileList = form.getFieldValue("fileList") || [];

                const find = currentImages.filter(
                  (item: string) =>
                    item !== targetKey &&
                    item !== v.fileName &&
                    item !== v.url
                );
                const newfind = currentFileList.filter(
                  (item: any) =>
                    item.uid !== v.uid &&
                    item.fileName !== v.fileName &&
                    item.url !== v.url
                );
                form.setFieldsValue({ images: find, fileList: newfind });
                setFormValues((prev: any) => ({
                  ...prev,
                  images: find,
                  fileList: newfind,
                }));
                if (targetKey) {
                  await fileDeleteWithPhoto({ filename: targetKey });
                }
              }}
              className="avatar-uploader"
              onPreview={(file) => handlePreview(file, dispatch)}
              customRequest={handleCustomUpload("images")}
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
