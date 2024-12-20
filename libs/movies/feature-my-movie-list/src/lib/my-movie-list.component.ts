import { NgFor, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { MovieService } from '@nx-workshop/movies/data-access-movies';
import { MovieSearchControlComponent } from '@nx-workshop/movies/feature-movie-search-control';
import { filter } from 'rxjs';
import { MovieModel } from '@nx-workshop/shared/models';

@Component({
  selector: 'app-my-movie-list',
  templateUrl: './my-movie-list.component.html',
  styleUrls: ['./my-movie-list.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MovieSearchControlComponent,
    NgTemplateOutlet,
    NgFor,
    FastSvgComponent,
  ],
})
export class MyMovieListComponent implements OnInit {
  myMovieForm = new UntypedFormGroup({
    movie: new UntypedFormControl(null, [
      Validators.required,
      ctrl => {
        return this.movieService
          .getFavorites()
          .find(favorite => favorite.id === ctrl.value?.id)
          ? { unique: true }
          : null;
      },
    ]),
    comment: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  // for easier access to the array
  favorites: UntypedFormArray = new UntypedFormArray(
    this.movieService
      .getFavorites()
      .map(favorite => this.createMovieForm(favorite))
  );

  favoritesForm = new UntypedFormGroup({ favorites: this.favorites });

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.favorites.valueChanges
      .pipe(filter(() => this.favorites.valid))
      .subscribe(() => {
        this.movieService.setFavorites(this.favorites.value);
      });
  }

  showError(controlName: string): boolean {
    const ctrl = this.myMovieForm.get(controlName);
    return !!(!ctrl?.valid && ctrl?.touched);
  }

  add(): void {
    if (this.myMovieForm.valid) {
      const favorite = {
        ...this.myMovieForm.value.movie,
        comment: this.myMovieForm.value.comment,
      };
      this.favorites.push(this.createMovieForm(favorite));
      this.reset();
    } else {
      this.myMovieForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.myMovieForm.reset({
      movie: null,
      comment: '',
    });
  }

  removeMovie(i: number): void {
    this.favorites.removeAt(i);
  }

  private createMovieForm(
    movie: MovieModel & { comment: string }
  ): UntypedFormGroup {
    return new UntypedFormGroup({
      id: new UntypedFormControl(movie.id),
      title: new UntypedFormControl(movie.title, Validators.required),
      comment: new UntypedFormControl(movie.comment, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }
}
