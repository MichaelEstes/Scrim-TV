package util

import (
	"bytes"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"strings"

	"github.com/nfnt/resize"
)

//GetFileExt get a file ext from file header
func GetFileExt(header *multipart.FileHeader) string {
	headerSplit := strings.Split(header.Filename, ".")
	return strings.ToLower(strings.Split(header.Filename, ".")[len(headerSplit)-1])
}

//ResizeImage so it's not huge
func ResizeImage(file multipart.File, ext string) (io.Reader, error) {
	if ext == "png" {
		return resizePngImage(file)
	}

	return resizeJpegImage(file)
}

func resizePngImage(file multipart.File) (io.Reader, error) {
	img, err := png.Decode(file)
	if err != nil {
		return nil, err
	}
	resizedImg := resize.Resize(600, 0, img, resize.Lanczos3)
	buf := new(bytes.Buffer)
	err = png.Encode(buf, resizedImg)
	if err != nil {
		return nil, err
	}
	return bytes.NewReader(buf.Bytes()), nil
}

func resizeJpegImage(file multipart.File) (io.Reader, error) {
	img, err := jpeg.Decode(file)
	if err != nil {
		return nil, err
	}
	resizedImg := resize.Resize(600, 0, img, resize.Lanczos3)
	buf := new(bytes.Buffer)
	err = jpeg.Encode(buf, resizedImg, nil)
	if err != nil {
		return nil, err
	}
	return bytes.NewReader(buf.Bytes()), nil
}
