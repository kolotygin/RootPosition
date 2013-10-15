using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using Size = System.Drawing.Size;

namespace Infrastructure.Imaging
{
    public class ImageServiceController
    {

        public Stream ResizeWithPoorQuality(string fullPath, int? width, int? height)
        {
            // create a bit-map object from the image path
            var bitmap = new Bitmap(fullPath);

            // resize actual image using width and height parameters
            var thumbnailSize = GetScaledSize(bitmap.Width, bitmap.Height, width, height);
            var thumbnail = bitmap.GetThumbnailImage(thumbnailSize.Width, thumbnailSize.Height, () => false, IntPtr.Zero);

            // create memory stream and save the resized image into a memory stream
            var memoryStream = new MemoryStream();
            thumbnail.Save(memoryStream, thumbnail.RawFormat);

            thumbnail.Dispose();
            memoryStream.Position = 0;
            return memoryStream;
        }

        public Stream ResizeWithMediumQuality(string fullPath, int? width, int? height)
        {
            var imageStream = new MemoryStream(File.ReadAllBytes(fullPath));
            var image = Image.FromStream(imageStream);

            var thumbnailSize = GetScaledSize(image.Width, image.Height, width, height);

            var thumbnail = new Bitmap(thumbnailSize.Width, thumbnailSize.Height);
            var graphics = Graphics.FromImage(thumbnail);
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphics.CompositingQuality = CompositingQuality.HighQuality;

            var imageRectangle = new Rectangle(0, 0, thumbnailSize.Width, thumbnailSize.Height);
            graphics.DrawImage(image, imageRectangle);

            var thumbnailStream = new MemoryStream();
            thumbnail.Save(thumbnailStream, image.RawFormat);

            imageStream.Dispose();
            graphics.Dispose();
            thumbnail.Dispose();
            image.Dispose();

            thumbnailStream.Position = 0;

            return thumbnailStream;
        }

        public Stream ResizeWithHighQuality(string fullPath, int? width, int? height)
        {
            var imageStream = new MemoryStream(File.ReadAllBytes(fullPath));
            var image = Image.FromStream(imageStream);

            var thumbnailSize = GetScaledSize(image.Width, image.Height, width, height);
            Image thumbnail = new Bitmap(thumbnailSize.Width, thumbnailSize.Height);
            var graphics = Graphics.FromImage(thumbnail);
            graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = SmoothingMode.HighQuality;
            graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphics.CompositingQuality = CompositingQuality.HighQuality;

            graphics.DrawImage(image, 0, 0, thumbnailSize.Width, thumbnailSize.Height);

            var info = ImageCodecInfo.GetImageEncoders();
            var encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, 100L);
            var thumbnailStream = new MemoryStream();
            thumbnail.Save(thumbnailStream, info[1], encoderParameters);
            thumbnailStream.Position = 0;

            imageStream.Dispose();
            graphics.Dispose();
            thumbnail.Dispose();
            image.Dispose();

            return thumbnailStream;
        }

        private static decimal GetAspectRatio(int width, int height)
        {
            return (decimal)width / (decimal)height;
        }

        private static Size GetScaledSize(int originalWidth, int originalHeight, int? desiredWidth, int? desiredHeight)
        {
            var size = new Size();
            // desired height is supplied -> calculate the new width;
            // or the original image is taller with respect to the ratio
            if (desiredHeight.HasValue && desiredHeight > 0 && (!desiredWidth.HasValue || desiredWidth == 0 || GetAspectRatio(desiredWidth.Value, desiredHeight.Value) > GetAspectRatio(originalWidth, originalHeight)))
            {
                var ratio = (decimal)desiredHeight / (decimal)originalHeight;
                size.Width = (int)Math.Round(originalWidth * ratio, MidpointRounding.ToEven); //get new width from the ratio of the new height to orginal height
                size.Height = desiredHeight.Value;
            }
            // desired width is supplied -> calculate the new height
            // or the original image is wider than thumbnail with respect to the ratio
            else if (desiredWidth.HasValue && desiredWidth > 0 && (!desiredHeight.HasValue || desiredHeight == 0 || GetAspectRatio(desiredWidth.Value, desiredHeight.Value) < GetAspectRatio(originalWidth, originalHeight)))
            {
                var ratio = (decimal)desiredWidth / (decimal)originalWidth;
                size.Height = (int)Math.Round(originalHeight * ratio, MidpointRounding.ToEven); //get new height from the ratio of the new width to orginal width
                size.Width = desiredWidth.Value;
            }
            return size;
        }

//        private static BitmapFrame Resize(BitmapFrame photo, int width, int height, BitmapScalingMode scalingMode)
//        {
//            DrawingGroup group = new DrawingGroup();
//            RenderOptions.SetBitmapScalingMode(group, scalingMode);
//            group.Children.Add(new ImageDrawing(photo, new Rect(0, 0, width, height)));
//            DrawingVisual targetVisual = new DrawingVisual();
//            DrawingContext targetContext = targetVisual.RenderOpen();
//            targetContext.DrawDrawing(group);
//            RenderTargetBitmap target = new RenderTargetBitmap(width, height, 96, 96, PixelFormats.Default);
//            targetContext.Close();
//            target.Render(targetVisual);
//            BitmapFrame targetFrame = BitmapFrame.Create(target);
//            return targetFrame;
//        }


    }
}
