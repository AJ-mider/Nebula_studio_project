package utils

import (
	"bytes"
	"io"
	"io/ioutil"
	"net/http"
	"regexp"
	"strings"
)

var (
	ReserveRequestRoutes = []string{
		"/api-nebula/db/",
		"/api/files",
		"/api/import-tasks",
	}
	ReserveResponseRoutes = []string{
		"/api-nebula/db/",
		"/api/import-tasks",
	}
	IgnoreHandlerBodyPatterns = []*regexp.Regexp{
		regexp.MustCompile(`^/api/import-tasks/\d+/download`),
	}
)

func CopyHttpRequest(r *http.Request) *http.Request {
	reqCopy := new(http.Request)

	if r == nil {
		return reqCopy
	}

	*reqCopy = *r

	if r.Body != nil {
		defer r.Body.Close()

		// Buffer body data
		var bodyBuffer bytes.Buffer
		newBodyBuffer := new(bytes.Buffer)

		io.Copy(&bodyBuffer, r.Body)
		*newBodyBuffer = bodyBuffer

		// Create new ReadClosers so we can split output
		r.Body = ioutil.NopCloser(&bodyBuffer)
		reqCopy.Body = ioutil.NopCloser(newBodyBuffer)
	}

	return reqCopy
}

func DisabledCookie(name string) *http.Cookie {
	return &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
	}
}

// dynamicly add query params to the request
func AddQueryParams(r *http.Request, params map[string]string) {
	query := r.URL.Query()
	for k, v := range params {
		query.Set(k, v)
	}
	r.URL, _ = r.URL.Parse(r.URL.Path + "?" + query.Encode())
}

func PathHasPrefix(path string, routes []string) bool {
	for _, route := range routes {
		if strings.HasPrefix(path, route) {
			return true
		}
	}
	return false
}

func PathMatchPattern(path string, patterns []*regexp.Regexp) bool {
	for _, pattern := range patterns {
		if pattern.MatchString(path) {
			return true
		}
	}
	return false
}
